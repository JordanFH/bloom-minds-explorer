import MemberCard from "../cards/member-card";

export default function TeamSection() {
  return (
    <section id="team" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">BloomMinds Team</h2>
          <p className="text-xl text-muted-foreground">
            Five passionate innovators united by the mission to visualize Earth's vegetation. 🌍✨
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto justify-items-center">
          {teamList.map((member) => (
            <MemberCard
              key={member.id}
              id={member.id}
              name={member.name}
              role={member.role}
              image={member.image}
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
    name: "TATIANA CENTURIÓN",
    role: "PROJECT LEADER",
    image: "/images/team/tatiana.jpeg",
  },
  {
    id: 2,
    name: "JHAZMÍN HUAMÁN ",
    role: "UI/UX DESIGNER",
     image: "/images/team/jhazmin.jpeg",
  },
  {
    id: 3,
    name: "JORDAN FERNÁNDEZ",
    role: "FULL STACK DEVELOPVER",
     image: "/images/team/jordan.jpeg",
  },
  {
    id: 4,
    name: "PABLO BURGOS",
    role: "FULL STACK DEVELOPVER",
     image: "/images/team/pablo.jpeg",
  },
  {
    id: 5,
    name: "GYNO ROMERO",
    role: "DATA ANALYST",
     image: "/images/team/gyno.jpeg",
  },
];
