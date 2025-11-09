import Image from "next/image";
import Avatar from "@/components/Avatar";
import { TechStackItem } from "./TechStackGrid";

interface UserCardProps {
  title: string;
  description: string;
  stack: TechStackItem[];
}

function UserCardTitle({ title }: { title: string }) {
  return <h1 className="font-extralight text-lg">{title}</h1>;
}

function UserCardDescription({ description }: { description: string }) {
  return (
    <p className="font-light text-sm whitespace-pre-line">
      {description}
    </p>
  );
}

function UserCardStack({ stack }: { stack: TechStackItem[] }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mt-2">
      {stack.map((item, index) => (
        <div key={index} className="w-6 sm:w-8 md:w-8">
          <Image
            src={item.logoUrl}
            alt={item.alt || ""}
            width={50}
            height={50}
            className="object-contain w-full h-auto"
          />
        </div>
      ))}
    </div>
  );
}

function CardContent({ title, description, stack }: {
  title: string;
  description: string;
  stack: TechStackItem[];
}) {
  return (
    <div className="flex items-center gap-18">
      <div className="flex flex-col gap-4">
        <UserCardTitle title={title} />
        <UserCardDescription description={description} />
        <h3 className="font-extralight text-xs">Tecnologías frecuentes</h3>
        <UserCardStack stack={stack} />
      </div>
      <Avatar
        src="/assets/images/avatar.jpg"
        alt="Rafael Fernández"
        size={200}
      />
    </div>
  );
}

export default function UserCard({ title, description, stack }: UserCardProps) {
  return (
    <div className="justify-self-center p-10 bg-[#000000cc] rounded-[20px]
                    overflow-hidden w-[80%] backdrop-blur-[4px] border border-[#111111]">
      <CardContent title={title} description={description} stack={stack} />
    </div>
  );
}
