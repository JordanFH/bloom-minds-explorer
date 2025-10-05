import { Card } from "../ui/card";

interface Props {
  id: number;
  name: string;
  role: string;
  image?: string;
}


 
export default function MemberCard({ id, name, role, image }: Props) {
  return (
    <Card className="p-6 bg-card border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 w-full max-w-sm">
      <div className="w-24 h-24 mx-auto mb-4">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-24 h-24 rounded-full object-cover border-4 border-primary/30 shadow-md"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {name.charAt(0)} {/* 👈 primera letra si no hay imagen */}
          </div>
        )}
      </div>

      <h3 className="text-xl font-bold text-center mb-2">{name}</h3>
      <p className="text-sm text-primary text-center mb-3">{role}</p>
      
    </Card>
  );
}

