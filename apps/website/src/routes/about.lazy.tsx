import { createLazyFileRoute } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { trpc } from "~/lib/api";

export const Route = createLazyFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className="p-2">
      <Button
        onClick={() => {
          trpc.event.create
            .mutate({
              day: 1,
              endHour: 8,
              startHour: 7,
              title: "Breakfast",
              location: "Home",
            })
            .then((d) => {
              console.log(d);
            });
        }}
      >
        click
      </Button>
    </div>
  );
}
