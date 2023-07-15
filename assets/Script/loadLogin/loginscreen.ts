import { _decorator, Component, instantiate, Node, Prefab, Tween, tween, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("loginscreen")
export class loginscreen extends Component {
    @property({ type: Prefab })
    form: Prefab;

    @property({ type: Node })
    button: Node;
    start() {}
    login() {
        let forms = instantiate(this.form);

        this.node.addChild(forms);
        this.button.active = false;

        tween(forms)
            .to(0.2, { scale: new Vec3(1, 1, 1), angle: 360 * 2 })
            .start();
    }
    update(deltaTime: number) {}
}
