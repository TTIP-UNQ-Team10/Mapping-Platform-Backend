import { NecessityController } from "./controller/NecessityController";

export const Routes = [
    {
        method: "get",
        route: "/necessities",
        controller: NecessityController,
        action: "all"
    },
    {
        method: "get",
        route: "/necessities/:id",
        controller: NecessityController,
        action: "one"
    },
    {
        method: "post",
        route: "/necessities",
        controller: NecessityController,
        action: "save"
    },
    {
        method: "delete",
        route: "/necessities/:id",
        controller: NecessityController,
        action: "remove"
    }
];