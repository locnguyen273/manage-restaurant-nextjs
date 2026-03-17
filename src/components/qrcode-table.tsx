'use client'

import QRCode from 'qrcode'
import { getTableLink } from '@/app/lib/utils'
import { useEffect, useRef } from 'react'

export default function QRCodeTable({
  token,
  tableNumber,
  width = 120
}: {
  token: string
  tableNumber: number
  width?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current!
    canvas.height = width + 50
    canvas.width = width
    const canvasContext = canvas.getContext('2d')!
    canvasContext.fillStyle = '#fff'
    canvasContext.fillRect(0,0, canvas.width, canvas.height)
    canvasContext.font = '12px Arial'
    canvasContext.textAlign = 'center'
    canvasContext.fillStyle = '#000'
    canvasContext.fillText(
      `Bàn số ${tableNumber}`,
      canvas.width / 2,
      canvas.width + 20
    )
    canvasContext.fillText(
      `Quét QR để gọi món`,
      canvas.width / 2,
      canvas.width + 50
    )
    const virtualCanvas = document.createElement('canvas')
    QRCode.toCanvas(virtualCanvas, getTableLink({ token: token, tableNumber: tableNumber }), function (error) {
      if (error) console.log(error)
      canvasContext.drawImage(virtualCanvas, 0, 0, width, width)
    })
  }, [token, tableNumber, width])

  return (
    <canvas ref={canvasRef}></canvas>
  )
}
