// global.d.ts

// 1. Estende a interface Window para incluir o objeto VLibras
interface Window {
  VLibras: any; // 'any' é suficiente, pois apenas precisamos que ele exista.
}

// 2. Estende os atributos HTML do React para incluir os atributos customizados do VLibras
declare namespace React {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // Adiciona os atributos que o VLibras precisa
    vw?: string;
    'vw-access-button'?: string;
    'vw-plugin-wrapper'?: string;
  }
}