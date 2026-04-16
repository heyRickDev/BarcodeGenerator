import { useRef, useEffect } from 'react'
import JsBarcode from 'jsbarcode'

interface BarcodeProps {
  value: number
}

export function Barcode({ value }: BarcodeProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (svgRef.current && value) {
      JsBarcode(svgRef.current, value, {
        format: 'CODE128',
        displayValue: true,
        fontSize: 8,
        margin: 2,
        width: 1,
        height: 20
      })
    }
  }, [value])
  console.log(value)
  
  return <svg ref={svgRef} className="barcode" />
}

export default Barcode
