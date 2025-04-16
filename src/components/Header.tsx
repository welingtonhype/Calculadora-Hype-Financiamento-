import React from 'react';
import { MessageSquare } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-[#020817] py-4 md:py-6 px-4 md:px-8" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <img 
            src="/lovable-uploads/85be3c52-822b-4879-bdc8-481c6e51cdff.png" 
            alt="Hype Empreendimentos Logo" 
            className="h-10 md:h-14 object-contain"
          />
        </div>
        
        <button 
          className="bg-[#00C896] hover:bg-[#00C896]/90 text-white px-3 md:px-4 py-2 rounded-lg h-9 md:h-10 transition-all duration-200 hover:shadow-md flex items-center gap-1.5 md:gap-2 text-sm md:text-base"
        >
          <MessageSquare className="h-3.5 w-3.5 md:h-4 md:w-4" />
          <span className="font-medium">Fale conosco</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
