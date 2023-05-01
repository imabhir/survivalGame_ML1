import { Director, color, director, log } from 'cc';
import { Color } from 'cc';
import { UITransform } from 'cc';
import { _decorator, Component, instantiate, Node, Prefab, Sprite, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameOver')
export class GameOver extends Component {
    @property(Node)
    Zombies: Node = null;

    @property(Node)
    Survivors: Node = null;

    @property(Prefab)
    Player: Prefab = null;

    @property(Prefab)
    Winner: Prefab = null;
    Prize

    protected onLoad(): void {
        this.Prize = instantiate(this.Winner)
        // this.InstantiateZombies()
        // this.InstantiateSurvivors()
        // this.CheckWinner(1, Prize)

        // this.GetWinner(1, 2, 2, Prize);
    }


    GetWinner(w, n1, n2) {
        this.InstantiateZombies(n1)
        this.InstantiateSurvivors(n2)
        this.CheckWinner(w)
    }

    InstantiateZombies(n1) {
        console.log("n1");

        for (let i = 0; i < n1; i++) {
            const Zombie = instantiate(this.Player)
            Zombie.getComponent(Sprite).color = Color.GREEN
            Zombie.setPosition(Zombie.getPosition().x + 100 * i, 0)
            this.Zombies.addChild(Zombie)
        }
    }

    InstantiateSurvivors(n2) {
        for (let i = 0; i < n2; i++) {
            const Survivor = instantiate(this.Player)
            // Survivor.getComponent(Sprite).  =Color
            Survivor.setPosition(Survivor.getPosition().x + 100 * i, 0)
            this.Survivors.addChild(Survivor)

        }
    }


    CheckWinner(CheckNumber, Prize = this.Prize) {
        if (CheckNumber == 0) {
            const NodeHeight = this.Zombies.getComponent(UITransform).height

            // For Scaling up and down node
            tween(this.Zombies).repeatForever(
                tween()
                    .to(0.5, { scale: new Vec3(1.1, 1.1, 0) })
                    .to(0.5, { scale: new Vec3(1.2, 1.2, 0) })
                    .to(0.5, { scale: new Vec3(1.3, 1.3, 0) })
                    .to(0.5, { scale: new Vec3(1, 1, 0) })
            )
                .start()
            Prize.setPosition(0, NodeHeight / 2)
            this.Zombies.addChild(Prize)
        } else {
            const NodeHeight = this.Survivors.getComponent(UITransform).height

            // For Scaling up and down node
            tween(this.Survivors).repeatForever(
                tween()
                    .to(0.5, { scale: new Vec3(1.1, 1.1, 0) })
                    .to(0.5, { scale: new Vec3(1.2, 1.2, 0) })
                    .to(0.5, { scale: new Vec3(1.3, 1.3, 0) })
                    .to(0.5, { scale: new Vec3(1, 1, 0) })
            )
                .start()
            Prize.setPosition(0, NodeHeight / 2)
            this.Survivors.addChild(Prize)
        }

    }


    start() {

    }
    tolobby() {


        director.loadScene("Avatar")
    }
    update(deltaTime: number) {

    }
}

