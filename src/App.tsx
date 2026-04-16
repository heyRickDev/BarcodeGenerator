import { useState } from 'react'
import { Barcode } from './components/Barcode'
import './index.css'
import Price from './components/Price'

export interface Product {
  // Code: string
  // Price: number
  // ProductName: string
  // quantity: number
  Código: number
  Descrição: string 
  PreçodeVenda: number
  Estoque: number
}

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [showBarcodes, setShowBarcodes] = useState(false)
  const [showPriceTags, setShowPriceTags] = useState(false)
  console.log(products)

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    import('xlsx').then((XLSX) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json<Product>(worksheet)
        setProducts(jsonData)
        setShowBarcodes(false)
        setShowPriceTags(false)
      }
      reader.readAsArrayBuffer(file)
    })
  }

  const generateBarcodes = () => {
    setShowBarcodes(true)
    setShowPriceTags(false)
  }
  const generatePriceTags = () => {
    setShowPriceTags(true)
    setShowBarcodes(false)
  }

  const handleClear = () => {
    setProducts([])
    setShowBarcodes(false)
    setShowPriceTags(false)
  }

  return (
    <div className="container">
      <header>
        <h1>Barcode Generator</h1>
        <div className="import-section">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileImport}
            id="file-input"
            className="file-input"
          />
          <label htmlFor="file-input" className="import-button">
            Import Excel File
          </label>
          
          {products.length > 0 && (
            <>
              <button onClick={showPriceTags ? generateBarcodes : generatePriceTags} className="generate-button">
                Generate {showPriceTags ? 'Barcodes' : 'Pricetag'}
              </button>
              <button onClick={handleClear} className="clear-button">
                Clear
              </button>
              <button onClick={print} className="print-button">
                Print
              </button>
            </>
          )}
        </div>
        {products.length > 0 && (
          <div className="products-count">
            Loaded {products.length} products
          </div>
        )}
      </header>

      {showBarcodes && (
        <div className="barcodes-section">
          {Array.from({ length: Math.ceil(products.length / 80) }).map((_, pageIndex) => (
            <div key={pageIndex} className="print-page-barcode">
              <div className="barcodes-grid">
                {products.slice(pageIndex * 80, (pageIndex + 1) * 80).flatMap((product, index) =>
                Array.from({ length: product.Estoque }, (_, i) => (
                  <div key={`${pageIndex}-${index}-${i}`} className="barcode-card">
                    <h2>{product.Descrição.slice(0, 25)}</h2>
                    <Barcode value={product.Código} />
                 </div>
                 ))
              )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showPriceTags && (
        <div className="barcodes-section">
          {Array.from({ length: Math.ceil(products.length / 9) }).map((_, pageIndex) => (
            <div key={pageIndex} className="print-page-pricetag">
              <div className="pricetags-grid">
                {products.slice(pageIndex * 9, (pageIndex + 1) * 9).map((product, index) => (
                  <div key={`${pageIndex}-${index}`} className="pricetag-card">
                    <h2>{product.Descrição.slice(0, 33)}</h2>
                    <Price price={product.PreçodeVenda}/>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
