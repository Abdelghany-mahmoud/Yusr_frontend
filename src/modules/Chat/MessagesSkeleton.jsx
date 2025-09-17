import { Skeleton } from "../../components/Skeleton/Skeleton";

export function MessagesSkeleton() {
  return (
    <div className="flex flex-col space-y-4 p-4 h-full">
      {[...Array(11)].map((_, i) => {
        const isMe = i % 2 === 0; // alternate sender/receiver
        return (
          <div
            key={i}
            className={`flex items-start space-x-3 ${isMe ? "justify-end" : "justify-start"
              }`}
          >
            {!isMe && <Skeleton className="h-8 w-8 rounded-full" />}

            <div
              className={`flex flex-col space-y-2 max-w-[70%] ${isMe ? "items-end" : "items-start"
                }`}
            >
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>

            {isMe && <Skeleton className="h-8 w-8 rounded-full" />}
          </div>
        );
      })}
    </div>
  );
}
