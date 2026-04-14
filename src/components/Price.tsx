import './styles/price.css'

interface PriceProps {
  price: number
  unit?: string
}

export function Price({ price, unit = 'UN' }: PriceProps) {
  return (
    <div className="price-tag">
      <span className="price-value">R$ {price.toFixed(2).replace('.',',')}</span>
      <span className="price-unit">{unit}</span>
    </div>
  )
}

export default Price
