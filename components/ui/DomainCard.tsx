interface DomainCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
  }
  
  export const DomainCard = ({ title, description, icon }: DomainCardProps) => (
    <div className="group relative bg-white/40 backdrop-blur-xl border border-white/60 p-10 rounded-[3rem] 
                    shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] 
                    transition-all duration-700 ease-out flex flex-col items-start text-left">
      
      {/* Icon Container */}
      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-8 
                      group-hover:scale-110 transition-transform duration-500">
        <div className="text-slate-400 group-hover:text-blue-600 transition-colors">
          {icon}
        </div>
      </div>
  
      <h3 className="text-2xl font-serif italic text-slate-800 mb-3">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed max-w-[240px]">
        {description}
      </p>
  
      {/* Subtle Glow Effect on Hover */}
      <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-blue-50/0 to-blue-50/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );