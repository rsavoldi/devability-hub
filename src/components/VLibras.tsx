// components/VLibras.tsx
"use client"; // useEffect e manipulação do DOM exigem "use client"

import React, { useEffect } from 'react';

const VLibras: React.FC = () => {
  // useEffect garante que o código só rodará no navegador, após o componente montar.
  useEffect(() => {
    // 1. Checa se o script JÁ existe no documento. Se sim, não faz nada.
    //    Isso previne a duplicação causada pelo Strict Mode.
    if (document.querySelector('#vlibras-script')) {
      return;
    }

    // 2. Cria a tag script dinamicamente
    const script = document.createElement('script');
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.id = 'vlibras-script'; // Adiciona um ID para a checagem acima
    script.async = true;
    
    // 3. Define a ação a ser tomada QUANDO o script terminar de carregar
    script.onload = () => {
      // Checa se a window.VLibras foi criada antes de tentar usá-la
      if (window.VLibras) {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
      }
    };

    // 4. Anexa o script ao final do body
    document.body.appendChild(script);

    // 5. Função de limpeza: será executada quando o componente for desmontado.
    //    Isso remove o widget se você navegar para uma página que não o tenha, por exemplo.
    return () => {
      // Tenta remover o botão e o script para uma limpeza completa
      const widgetRoot = document.querySelector('[vw-plugin-wrapper]');
      const accessButton = document.querySelector('[vw-access-button]');
      if (widgetRoot) widgetRoot.remove();
      if (accessButton) accessButton.remove();
    };
  }, []); // O array de dependências vazio `[]` garante que este efeito rode apenas UMA VEZ.

  // O componente ainda precisa retornar as divs que o script vai usar.
  return (
    <div vw="true" className="enabled">
      <div vw-access-button="true" className="active"></div>
      <div vw-plugin-wrapper="true">
        <div className="vw-plugin-top-wrapper"></div>
      </div>
    </div>
  );
};

export default VLibras;