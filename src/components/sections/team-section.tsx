import MemberCard from "../cards/member-card";

export default function TeamSection() {
  return (
    <section id="team" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Equipo Bloom MInds</h2>
          <p className="text-xl text-muted-foreground">
            Cinco innovadores apasionados unidos por la misión de visualizar la vegetación de la
            Tierra
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto justify-items-center">
          {teamList.map((member) => (
            <MemberCard
              key={member.id}
              id={member.id}
              name={member.name}
              role={member.role}
              description={member.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const teamList = [
  {
    id: 1,
    name: "Pablo Burgos",
    role: "Project Manager",
    description: "Coordina al equipo y supervisa el desarrollo del proyecto.",
  },
  {
    id: 2,
    name: "Jazmin ",
    role: "Frontend Developer",
    description: "Diseña y desarrolla la interfaz de usuario con React y Tailwind.",
  },
  {
    id: 3,
    name: "Jordan Fernández",
    role: "Backend Developer",
    description: "Implementa la lógica del servidor y la integración con la base de datos.",
  },
  {
    id: 4,
    name: "Tatiana Centurión",
    role: "UI/UX Designer",
    description: "Crea prototipos interactivos y optimiza la experiencia del usuario.",
  },
  {
    id: 5,
    name: "Gyno Romero",
    role: "QA Engineer",
    description: "Realiza pruebas y asegura la calidad del producto antes del despliegue.",
  },
];
