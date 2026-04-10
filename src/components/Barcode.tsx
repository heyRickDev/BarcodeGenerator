import { useRef, useEffect } from 'react'
import JsBarcode from 'jsbarcode'

interface BarcodeProps {
  value: string
}

export function Barcode({ value }: BarcodeProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (svgRef.current && value) {
      JsBarcode(svgRef.current, value, {
        format: 'CODE128',
        displayValue: true,
        fontSize: 8,
        margin: 10,
        width: 2,
        height: 20
      })
    }
  }, [value])
  console.log(value)
  
  return <svg ref={svgRef} className="barcode" />
}

export default Barcode
