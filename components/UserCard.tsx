import Image from "next/image";
import Avatar from "@/components/Avatar";
import { TechStackItem } from "./TechStackGrid";

interface UserCardProps {
  title: string;
  description: string;
  stack: TechStackItem[];
}

function UserCardTitle({ title }: { title: string }) {
  return (
    <h1 className="font-extralight text-lg">
      {title.split(" ").map((word, index, arr) => (
        <span key={index}>
          {word}
          {index < arr.length - 1 && (
            <>
              <br className="block md:hidden" />
              <span className="hidden md:inline"> </span>
            </>
          )}
        </span>
      ))}
    </h1>
  );
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
    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-18">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-row justify-between items-center w-full">
          <UserCardTitle title={title} />
          <div className="block md:hidden w-18 h-18 shrink-0">
            <Avatar
              src="/assets/images/avatar.jpg"
              alt="Rafael Fernández"
            />
          </div>
        </div>
        <UserCardDescription description={description} />
        <h3 className="font-extralight text-xs">Tecnologías frecuentes</h3>
        <UserCardStack stack={stack} />
      </div>
      <div className="hidden md:block w-60 h-60 shrink-0">
        <Avatar
          src="/assets/images/avatar.jpg"
          alt="Rafael Fernández"
        />
      </div>
    </div>
  );
}

export default function UserCard({ title, description, stack }: UserCardProps) {
  return (
    <div className="justify-self-center p-10 bg-[#000000cc] light:bg-[#30303033] rounded-[20px]
                    overflow-hidden w-[100%] md:w-[80%] backdrop-blur-[4px] border border-[#111111] light:border-[#c0c0c0]">
      <CardContent title={title} description={description} stack={stack} />
    </div>
  );
}
