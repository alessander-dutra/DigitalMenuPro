import { useState, useEffect } from 'react';
import { Printer, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface PrinterSelectorProps {
  value?: string;
  onValueChange: (printer: string) => void;
  label?: string;
}

export function PrinterSelector({ value, onValueChange, label = "Impressora de Produção" }: PrinterSelectorProps) {
  // Convert empty string to 'none' for SelectItem compatibility
  const normalizedValue = value === '' ? 'none' : value;
  const [printers, setPrinters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const detectPrinters = async () => {
    setIsLoading(true);
    try {
      // Primeiro, tentamos usar a Web Print API (se disponível)
      if ('navigator' in window && 'printing' in (window.navigator as any)) {
        const printerList = await (window.navigator as any).printing.getPrinters();
        setPrinters(printerList.map((p: any) => p.name));
        return;
      }

      // Método alternativo: usar window.print() e detectar impressoras através de CSS media queries
      const testPrint = () => {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
          iframeDoc.write(`
            <html>
              <head>
                <script>
                  window.onload = function() {
                    const printers = [];
                    
                    // Detecta impressoras através de media queries CSS
                    const mediaQueries = [
                      'print',
                      'screen and (min-resolution: 300dpi)',
                      'screen and (min-resolution: 600dpi)'
                    ];
                    
                    mediaQueries.forEach(query => {
                      if (window.matchMedia(query).matches) {
                        printers.push('Impressora Padrão');
                      }
                    });
                    
                    window.parent.postMessage({ printers }, '*');
                  };
                </script>
              </head>
              <body></body>
            </html>
          `);
          iframeDoc.close();
        }
        
        setTimeout(() => document.body.removeChild(iframe), 1000);
      };

      // Lista de impressoras comuns como fallback
      const commonPrinters = [
        'Impressora Padrão',
        'Microsoft Print to PDF',
        'Fax',
        'HP LaserJet',
        'Canon PIXMA',
        'Epson L3150',
        'Brother DCP',
        'Samsung Xpress'
      ];

      // Se não conseguir detectar automaticamente, mostra impressoras comuns
      setPrinters(commonPrinters);
      
      testPrint();
      
    } catch (error) {
      console.error('Erro ao detectar impressoras:', error);
      toast({
        title: "Aviso",
        description: "Não foi possível detectar as impressoras automaticamente. Mostrando lista padrão.",
        variant: "destructive",
      });
      
      // Fallback para impressoras comuns
      setPrinters([
        'Impressora Padrão',
        'Microsoft Print to PDF',
        'HP LaserJet',
        'Canon PIXMA',
        'Epson L3150',
        'Brother DCP'
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    detectPrinters();

    // Listener para detectar impressoras via postMessage
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.printers) {
        setPrinters(prev => {
          const uniquePrinters = [...prev, ...event.data.printers];
          return Array.from(new Set(uniquePrinters));
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="printer-selector">{label}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={detectPrinters}
          disabled={isLoading}
          className="h-8 px-2"
        >
          <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>
      
      <Select 
        value={normalizedValue} 
        onValueChange={(selectedValue) => {
          // Convert 'none' back to empty string for compatibility
          const finalValue = selectedValue === 'none' ? '' : selectedValue;
          onValueChange(finalValue);
        }}
      >
        <SelectTrigger id="printer-selector">
          <div className="flex items-center">
            <Printer className="h-4 w-4 mr-2 text-gray-500" />
            <SelectValue placeholder="Selecione uma impressora..." />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Nenhuma impressora</SelectItem>
          {printers.map((printer, index) => (
            <SelectItem key={index} value={printer}>
              {printer}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {printers.length === 0 && !isLoading && (
        <p className="text-sm text-gray-500">
          Nenhuma impressora detectada. Clique em "Atualizar" para tentar novamente.
        </p>
      )}
      
      <p className="text-xs text-gray-400">
        💡 Dica: Esta impressora será usada para imprimir comandas de produção deste item.
      </p>
    </div>
  );
}