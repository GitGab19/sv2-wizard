// Info card component for wizard steps
import { Card, CardContent } from "../../components/ui/card";

export const InfoCard = ({ number, title, icon: Icon, children }: { number: number, title: string, icon: any, children: React.ReactNode }) => (
  <Card className="bg-card/40 border-border/50 relative overflow-hidden group hover:border-primary/30 transition-colors h-full">
    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
      <Icon className="w-12 h-12 text-primary" />
    </div>
    <CardContent className="p-5">
      <div className="flex items-center gap-3 mb-3">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold font-mono">
          {number}
        </span>
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      {children}
    </CardContent>
  </Card>
);

