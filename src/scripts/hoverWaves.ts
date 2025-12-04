import { gsap } from 'gsap'
import { PixiPlugin } from 'gsap/PixiPlugin'
import * as PIXI from 'pixi.js'

gsap.registerPlugin(PixiPlugin)
PixiPlugin.registerPIXI(PIXI)

export async function hoverWaves() {
  // 複数のcanvas要素を取得
  const canvasElements = document.querySelectorAll<HTMLCanvasElement>(
    'canvas[data-hover-effect="wave"]',
  )
  if (canvasElements.length === 0) {
    console.warn('No canvas elements found with data-hover-effect="wave"')
    return
  }

  // 各canvas要素に対してwave効果を初期化
  const promises = Array.from(canvasElements).map((canvasElement) =>
    initSingleWaveEffect(canvasElement),
  )

  // 全ての初期化を並行実行
  await Promise.all(promises)
}

// 単一のcanvas要素に対するwave効果の初期化
async function initSingleWaveEffect(canvasElement: HTMLCanvasElement) {
  const canvasSprite = canvasElement.dataset.image

  // data-width / data-height を数値取得（未設定の場合は null）
  const attrWidth = canvasElement.dataset.width
    ? parseInt(canvasElement.dataset.width, 10)
    : null
  const attrHeight = canvasElement.dataset.height
    ? parseInt(canvasElement.dataset.height, 10)
    : null

  // スタイルからの計算値を取得
  const computedStyle = window.getComputedStyle(canvasElement)
  const styleWidth = parseInt(computedStyle.width, 10)
  const styleHeight = parseInt(computedStyle.height, 10)

  // data属性が指定されていればそれを使用、なければCSS表示サイズの2倍
  const width = attrWidth !== null ? attrWidth * 2 : styleWidth * 2
  const height = attrHeight !== null ? attrHeight * 2 : styleHeight * 2

  const app = new PIXI.Application()

  try {
    await app.init({
      canvas: canvasElement,
      width: width,
      height: height,
      backgroundAlpha: 0,
    })
  } catch (error) {
    console.error('Failed to initialize PIXI Application:', error)
    return
  }

  try {
    // メインテクスチャを読み込み（data属性から画像パスを取得、なければデフォルト）
    const imagePath = canvasSprite || '/assets/top/wave_conference_right.png'
    const texture = await PIXI.Assets.load(imagePath)

    // ディスプレイスメント用テクスチャを読み込み
    const displacementTexture = await PIXI.Assets.load(
      '/assets/top/wave_distortion.png',
    )
    const displacementSprite = new PIXI.Sprite(displacementTexture)

    // ディスプレイスメントスプライトを設定
    displacementSprite.texture.source.style.addressMode = 'repeat'
    displacementSprite.width = width / 2
    displacementSprite.height = height / 2
    displacementSprite.anchor.set(0.5, 0.5) // 中央アンカー
    displacementSprite.x = width / 2 // 中央に配置
    displacementSprite.y = height / 2

    // 表示上のCSSスケール (例: canvas が内部 800px, 表示 400px なら 0.5)
    const displayedWidth = parseInt(computedStyle.width, 10) || width
    const cssScaleX = displayedWidth / width // 0.5 など
    // 本来の見え方を維持するため内部スケール補正: 元の 80 を表示縮小率で割る
    const baseDisplacementScale = 80
    const compensatedScale =
      cssScaleX > 0 ? baseDisplacementScale / cssScaleX : baseDisplacementScale

    // ディスプレイスメントフィルターを作成（動的補正スケール）
    const displacementFilter = new PIXI.DisplacementFilter({
      sprite: displacementSprite,
      scale: compensatedScale,
    })

    // 旧: imageSprite を直接 width/height にフィットさせていたが未使用のため削除（高解像度対応へ簡素化）

    // フィルターなしの通常画像を作成（背景）
    const normalImageSprite = new PIXI.Sprite(texture)
    // 実際の表示サイズをそのまま使用（2倍キャンバスが既に反映されているため）
    normalImageSprite.width = width
    normalImageSprite.height = height
    normalImageSprite.anchor.set(0.5, 0.5) // 中央アンカー
    normalImageSprite.x = width / 2 // 中央に配置
    normalImageSprite.y = height / 2

    // フィルター付きのアニメーション画像を作成（実サイズで描画）
    const animatedImageSprite = new PIXI.Sprite(texture)
    animatedImageSprite.width = width
    animatedImageSprite.height = height
    animatedImageSprite.anchor.set(0.5, 0.5) // 中央アンカー
    // ディスプレイスメントフィルターのオフセットを補正 - 左上に移動
    const offsetX = 0 // 左方向補正
    const offsetY = 0 // 上方向補正
    animatedImageSprite.x = width / 2 + offsetX
    animatedImageSprite.y = height / 2 + offsetY
    animatedImageSprite.filters = [displacementFilter]

    // 滑らかなエッジのための円形グラデーションマスクを作成
    // data-mask-radius 属性から取得、未指定の場合はデフォルトの 500
    const maskRadius = canvasElement.dataset.maskRadius
      ? parseInt(canvasElement.dataset.maskRadius, 10)
      : 500

    // グラデーションマスク用のレンダーテクスチャを作成
    const maskTexture = PIXI.RenderTexture.create({
      width: maskRadius * 2,
      height: maskRadius * 2,
    })
    const maskGraphics = new PIXI.Graphics()

    // アルファ値が減少するグラデーション円を描画
    for (let i = 0; i <= 60; i++) {
      const radius = (maskRadius / 36) * i
      const alpha = Math.max(0, 1 - (i / 60) * 1.6) // より強いグラデーション

      maskGraphics.circle(maskRadius, maskRadius, radius)
      maskGraphics.fill({ color: 0xffffff, alpha: alpha })
    }

    // グラデーションをテクスチャにレンダリング
    app.renderer.render({ container: maskGraphics, target: maskTexture })

    // グラデーションテクスチャからマスクスプライトを作成
    const mask = new PIXI.Sprite(maskTexture)
    mask.anchor.set(0.5, 0.5) // マスクを中央に配置

    // 初期位置をcanvasの中央に設定（デバッグ用）
    mask.x = width / 2
    mask.y = height / 2

    // アニメーションスプライトにマスクを適用
    animatedImageSprite.mask = mask

    // 全てのスプライトをステージに追加
    app.stage.addChild(displacementSprite)
    app.stage.addChild(normalImageSprite) // 背景（アニメーションなし）
    app.stage.addChild(animatedImageSprite) // アニメーション版（マスク適用済み）
    app.stage.addChild(mask) // マスクもステージに追加が必要

    // アニメーションを開始
    startWaveAnimation(displacementSprite, maskRadius)

    // マウストラッキングを追加
    setupMouseTracking(canvasElement, mask, maskRadius)
  } catch (error) {
    console.error('Failed to load image:', error)

    const fallbackGraphics = new PIXI.Graphics()
    fallbackGraphics.rect(0, 0, width, height)
    fallbackGraphics.fill(0x333333)
    app.stage.addChild(fallbackGraphics)
  }
}

// 波エフェクト用のアニメーション関数
function startWaveAnimation(
  displacementSprite: PIXI.Sprite,
  maskRadius: number,
) {
  // 初期の中央位置を保存
  const centerX = displacementSprite.x

  // デフォルト値500を基準としてアニメーションスピードを比例計算
  // マスク半径が大きいほどアニメーションが早くなる（duration が短くなる）
  const baseRadius = 500
  const baseDuration = 3
  const baseRotationDuration = 8
  const baseMoveDistance = 50
  const speedRatio = baseRadius / maskRadius
  const duration = baseDuration * speedRatio
  const rotationDuration = baseRotationDuration * speedRatio
  const moveDistance = baseMoveDistance * (maskRadius / baseRadius)

  // 中央を基準としたX位置のアニメーション
  const tl = gsap.timeline({ repeat: -1 })
  tl.fromTo(
    displacementSprite,
    { pixi: { x: centerX + moveDistance } },
    {
      pixi: { x: centerX - moveDistance },
      duration: duration,
      ease: 'sine.inOut',
    },
  ).to(displacementSprite, {
    pixi: { x: centerX + moveDistance },
    duration: duration,
    ease: 'sine.inOut',
  })

  gsap.to(displacementSprite, {
    pixi: { rotation: 0.05 },
    duration: rotationDuration,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut',
  })
}

// マスク位置調整用のマウストラッキング関数
function setupMouseTracking(
  canvasElement: HTMLCanvasElement,
  mask: PIXI.Sprite,
  maskRadius: number,
) {
  let mouseX = 0
  let mouseY = 0
  const centerX = mask.x
  const centerY = mask.y
  const hiddenScale = 0.01
  let isMaskActive = false

  // デフォルト値500を基準としてアニメーションスピードを比例計算
  // マスク半径が大きいほどアニメーションが早くなる（duration が短くなる）
  const baseRadius = 500
  const baseMoveSpeed = 0.1
  const baseShowDuration = 0.3
  const baseHideDuration = 0.15
  const baseHideScaleDuration = 0.2
  const speedRatio = baseRadius / maskRadius
  const moveSpeed = baseMoveSpeed * speedRatio
  const showDuration = baseShowDuration * speedRatio
  const hideDuration = baseHideDuration * speedRatio
  const hideScaleDuration = baseHideScaleDuration * speedRatio

  // 初期状態ではマスクを縮小・非表示にしておく
  mask.scale.set(hiddenScale)
  mask.alpha = 0
  mask.position.set(centerX, centerY)

  // マウス移動時のマスク位置更新
  const updateMaskPosition = (event: MouseEvent) => {
    if (!isMaskActive) return

    const rect = canvasElement.getBoundingClientRect()

    // CSSスケールを考慮してcanvas中央を基準としたマウス位置を計算
    const scaleX = canvasElement.width / rect.width
    const scaleY = canvasElement.height / rect.height

    // 中央を原点とするcanvas座標に変換
    mouseX = (event.clientX - rect.left) * scaleX
    mouseY = (event.clientY - rect.top) * scaleY

    // スムーズなアニメーションでマスク位置を更新
    gsap.to(mask, {
      pixi: { x: mouseX, y: mouseY },
      duration: moveSpeed,
      ease: 'power2.out',
    })
  }

  // マウスがcanvasを離れたときマスクを非表示
  const hideMask = () => {
    isMaskActive = false
    gsap.killTweensOf(mask)
    gsap.killTweensOf(mask.scale)

    const tl = gsap.timeline()
    tl.to(mask, {
      pixi: { alpha: 0 },
      duration: hideDuration,
      ease: 'power2.out',
    })
    tl.to(
      mask.scale,
      {
        x: hiddenScale,
        y: hiddenScale,
        duration: hideScaleDuration,
        ease: 'power2.out',
      },
      0,
    )
    tl.add(() => {
      mask.position.set(centerX, centerY)
    }, '>')
  }

  // マウスがcanvasに入ったときマスクを表示
  const showMask = () => {
    gsap.killTweensOf(mask)
    gsap.killTweensOf(mask.scale)
    isMaskActive = true
    gsap.to(mask, {
      pixi: { alpha: 1 },
      duration: showDuration,
      ease: 'power2.out',
    })
    gsap.to(mask.scale, {
      x: 1,
      y: 1,
      duration: showDuration,
      ease: 'power2.out',
    })
  }

  // イベントリスナーを追加
  canvasElement.addEventListener('mousemove', updateMaskPosition)
  canvasElement.addEventListener('mouseenter', showMask)
  canvasElement.addEventListener('mouseleave', hideMask)

  mask.position.set(centerX, centerY)
}
