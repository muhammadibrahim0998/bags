import React, { useRef } from 'react';
import { X, Printer, ShoppingBag, Download } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

export function ReceiptModal({ isOpen, onClose, sale }) {
  const printRef = useRef(null);
  const { settings } = useSettings();

  if (!isOpen || !sale) return null;

  const currency = settings.currency || 'Rs.';

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open('', '_blank');
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${new Date(sale.saleDate).toLocaleDateString()}</title>
          <style>
            @page { margin: 10mm; }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Courier New', monospace; padding: 10px; max-width: 380px; margin: auto; font-size: 13px; line-height: 1.4; color: #000; background: white; }
            .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 12px; margin-bottom: 15px; }
            .shop-name { font-size: 24px; font-weight: bold; margin-bottom: 4px; text-transform: uppercase; }
            .subtitle { font-size: 11px; color: #000; margin-top: 2px; }
            .meta { margin: 12px 0; font-size: 12px; }
            .flex { display: flex; }
            .justify-between { justify-content: space-between; }
            .flex-col { flex-direction: column; }
            .items-center { align-items: center; }
            .text-left { text-align: left; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .font-bold { font-weight: bold; }
            .font-black { font-weight: 900; }
            .uppercase { text-transform: uppercase; }
            
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th { border-bottom: 1px dashed #000; padding: 8px 2px; font-size: 11px; font-weight: bold; }
            td { padding: 8px 2px; font-size: 12px; vertical-align: top; border-bottom: 1px dotted #eee; }
            
            .total-row { font-weight: bold; font-size: 20px; border-top: 2px dashed #000; padding-top: 10px; margin-top: 10px; display: flex; justify-content: space-between; width: 100%; }
            .divider { border-top: 1px dashed #000; margin: 10px 0; }
            
            .footer { text-align: center; margin-top: 25px; padding-top: 15px; border-top: 1px dashed #000; display: flex; flex-direction: column; align-items: center; }
            .footer img { width: 90px; height: 90px; margin-bottom: 12px; border: 1px solid #000; padding: 2px; }
            .footer p { font-size: 11px; }

            @media print { 
              body { padding: 0; width: 100%; } 
              .no-print { display: none; } 
              img { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          ${content}
          <script>window.onload = () => { window.print(); window.close(); }<\/script>
        </body>
      </html>
    `);
    win.document.close();
  };

  const handleDownload = () => {
    if (!sale.invoiceUrl) return;
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    window.open(`${apiUrl}${sale.invoiceUrl}`, '_blank');
  };

  const saleDate = new Date(sale.saleDate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-[95%] sm:w-[500px] bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border-subtle)] shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto scrollbar-hide z-10 mx-auto">
        {/* Modal Content - No Top Header */}
        <div className="relative pt-2">
          {/* Close button moved slightly for convenience if needed, but header removed */}
          <button onClick={onClose} className="absolute -top-1 -right-1 p-2 text-zinc-400 hover:text-rose-500 z-50">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Receipt Preview Area */}
        <div className="p-4 bg-zinc-100/30 flex flex-col sm:flex-row items-center sm:items-start justify-center gap-4">

          {/* Extra Compact Bill (Left) */}
          <div ref={printRef} className="bg-white border-2 border-zinc-300 rounded-[1.5rem] p-5 sm:p-7 font-mono text-[11px] shadow-2xl text-black w-full max-w-[300px] relative overflow-hidden">
            {/* Top Border Accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600"></div>

            {/* Header - Set professionally */}
            <div className="text-center border-b-2 border-dashed border-zinc-200 pb-4 mb-4 mt-1">
              <div className="text-2xl font-[1000] tracking-tighter uppercase leading-none text-black drop-shadow-sm">{settings.shopName}</div>
              <div className="text-[9px] font-black text-zinc-600 mt-2 uppercase tracking-[0.2em] leading-tight">{settings.address || 'INVENTORY HUB'}</div>
              <div className="h-1 w-12 bg-blue-600 mx-auto mt-2 rounded-full"></div>
            </div>

            {/* Info Grid - Bolder & Clearer */}
            <div className="space-y-1.5 mb-4 text-black">
              <div className="flex justify-between items-center">
                <span className="font-[1000] text-[10px] uppercase tracking-tighter">REFERENCE:</span>
                <span className="font-[1000] text-[11px] uppercase">#{sale._id?.slice(-6).toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center border-b-2 border-zinc-100 pb-1.5">
                <span className="font-[1000] text-[10px] uppercase tracking-tighter">DATE / TIME:</span>
                <span className="font-[1000] text-[11px] uppercase">{saleDate.toLocaleDateString('en-PK', { day: '2-digit', month: 'short' })} • {saleDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="font-[1000] text-[10px] uppercase tracking-tighter">CUSTOMER:</span>
                <span className="font-[1000] text-[11px] uppercase truncate ml-4 text-right">{sale.customerName || "WALK-IN"}</span>
              </div>
            </div>

            {/* Items Table - Bold & Professional */}
            <div className="mb-4">
              <div className="flex justify-between border-b-2 border-dashed border-zinc-200 pb-2 mb-2">
                <span className="text-[10px] font-[1000] uppercase text-black tracking-widest">ITEM DETAIL</span>
                <span className="text-[10px] font-[1000] uppercase text-black tracking-widest">TOTAL</span>
              </div>
              <div className="space-y-3">
                {sale.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start leading-tight text-black">
                    <div className="flex flex-col pr-4">
                      <span className="text-[12px] font-[1000] uppercase leading-none mb-1">{item.name}</span>
                      <span className="text-[10px] font-black italic">{item.quantity} x {currency}{item.price?.toLocaleString()}</span>
                    </div>
                    <span className="text-[13px] font-[1000]">{currency}{item.subtotal?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Section (Ultra Compact) */}
            <div className="bg-zinc-900 rounded-xl p-2 mt-2 text-white text-center shadow-md border-b-2 border-zinc-800">
              <span className="block text-[7px] font-black uppercase tracking-[0.2em] text-zinc-400 leading-none mb-0.5">GRAND TOTAL DUE</span>
              <span className="text-xl font-[1000] tracking-tighter leading-none">{currency} {sale.totalAmount?.toLocaleString('en-PK')}</span>
            </div>

            {/* Print QR (Visible in print) */}
            <div className="hidden print:flex flex-col items-center mt-6">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(`#${sale._id}`)}`}
                alt="Print QR"
                className="w-20 h-20"
              />
            </div>

            <div className="text-center mt-6 pt-4 border-t-2 border-dashed border-zinc-200">
              <p className="text-[12px] font-[1000] uppercase italic tracking-widest text-black">VISIT AGAIN!</p>
              <p className="text-[9px] font-[1000] uppercase text-black/40 mt-2 tracking-tighter">Powered by KSA Inventory</p>
            </div>
          </div>

          {/* Action Sidebar (Right) */}
          <div className="flex flex-col gap-3 w-full sm:w-[130px] bg-white p-4 border-2 border-zinc-200 rounded-[1.5rem] shadow-xl">
            <button
              onClick={handlePrint}
              className="flex flex-col items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
            >
              <Printer className="w-5 h-5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex flex-col items-center justify-center gap-2 py-4 bg-zinc-50 border border-zinc-200 text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-100 transition-all active:scale-95"
            >
              <Download className="w-5 h-5 text-zinc-500" />
              <span>PDF</span>
            </button>
            <button
              onClick={onClose}
              className="py-4 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-95"
            >
              Close
            </button>

            {/* Sidebar QR Code */}
            <div className="mt-1 p-2 bg-zinc-50 border border-zinc-100 rounded-xl flex flex-col items-center gap-1 shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  `--- ${settings.shopName} ---\nRef: #${sale._id?.slice(-8).toUpperCase()}\nItems:\n${sale.items.map(item => `${item.name} (${item.quantity})`).join('\n')}\nTotal: ${currency} ${sale.totalAmount}`
                )}`}
                alt="Sidebar QR"
                className="w-16 h-16 rounded-md"
              />
              <span className="text-[7px] font-black text-zinc-400 uppercase tracking-tighter text-center">Scan to Verify Items</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
