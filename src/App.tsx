import { useState, useMemo } from 'react'
import { Barcode } from './components/Barcode'
import './index.css'
import Price from './components/Price'

export interface Product {
  Código: string
  Descrição: string 
  PreçodeVenda: number
  Estoque: number
}

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [showBarcodes, setShowBarcodes] = useState(false)
  const [showPriceTags, setShowPriceTags] = useState(false)

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

  const barcodePages = useMemo(() => {
    const allCards: { product: Product }[] = []
    products.forEach((product) => {
      for (let i = 0; i < product.Estoque; i++) {
        allCards.push({ product })
      }
    })
    
    const pageCount = Math.ceil(allCards.length / 80)
    return Array.from({ length: pageCount }).map((_, pageIndex) => ({
      cards: allCards.slice(pageIndex * 80, (pageIndex + 1) * 80),
      pageIndex
    }))
  }, [products])

  const pricetagPages = useMemo(() => {
    const pageCount = Math.ceil(products.length / 9)
    return Array.from({ length: pageCount }).map((_, pageIndex) => ({
      products: products.slice(pageIndex * 9, (pageIndex + 1) * 9),
      pageIndex
    }))
  }, [products])

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
          {barcodePages.map(({ cards, pageIndex }) => (
            <div key={pageIndex} className="print-page-barcode">
              <div className="barcodes-grid">
                {cards.map(({ product }, index) => (
                  <div key={`${pageIndex}-${index}`} className="barcode-card">
                    <h2>{product.Descrição.slice(0, 25)}</h2>
                    <Barcode value={product.Código} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showPriceTags && (
        <div className="barcodes-section">
          {pricetagPages.map(({ products: pageProducts, pageIndex }) => (
            <div key={pageIndex} className="print-page-pricetag">
              <div className="pricetags-grid">
                {pageProducts.map((product, index) => (
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
