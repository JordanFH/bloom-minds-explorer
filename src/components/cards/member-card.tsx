import { Card } from "../ui/card";

interface Props {
  id: number;
  name: string;
  role: string;
  description: string;
}

export default function MemberCard({ id, name, role, description }: Props) {
  return (
    <Card className="p-6 bg-card border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 w-full max-w-sm">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center">
        <span className="text-3xl font-bold text-white">{id}</span>
      </div>
      <h3 className="text-xl font-bold text-center mb-2">{name}</h3>
      <p className="text-sm text-primary text-center mb-3">{role}</p>
      <p className="text-sm text-muted-foreground text-center leading-relaxed">{description}</p>
    </Card>
  );
}
