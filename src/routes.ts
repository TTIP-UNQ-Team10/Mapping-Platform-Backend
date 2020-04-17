import {UserController} from "./controller/UserController";
import { NecessityController } from "./controller/NecessityController";
import { CoordinateController } from "./controller/CoordinateController";

export const Routes = [
    {
        method: "get",
        route: "/users",
        controller: UserController,
        action: "all"
    },
    {
        method: "get",
        route: "/necessities",
        controller: NecessityController,
        action: "all"
    },
    {
        method: "get",
        route: "/coordinates",
        controller: CoordinateController,
        action: "all"
    }, 
    {
        method: "get",
        route: "/users/:id",
        controller: UserController,
        action: "one"
    },
    {
        method: "get",
        route: "/necessities/:id",
        controller: NecessityController,
        action: "one"
    },
    {
        method: "get",
        route: "/coordinates/:id",
        controller: CoordinateController,
        action: "one"
    },
    {
        method: "post",
        route: "/users",
        controller: UserController,
        action: "save"
    },
    {
        method: "post",
        route: "/necessities",
        controller: NecessityController,
        action: "save"
    },
    {
        method: "post",
        route: "/coordinates",
        controller: CoordinateController,
        action: "save"
    },
    {
        method: "delete",
        route: "/users/:id",
        controller: UserController,
        action: "remove"
    },
    {
        method: "delete",
        route: "/necessities/:id",
        controller: NecessityController,
        action: "remove"
    },
    {
        method: "delete",
        route: "/coordinates/:id",
        controller: CoordinateController,
        action: "remove"
    }
];