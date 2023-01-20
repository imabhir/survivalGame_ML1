System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, UITransform, Vec3, Vec2, Animation, ImageAsset, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, PlayerMovement;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Node = _cc.Node;
      UITransform = _cc.UITransform;
      Vec3 = _cc.Vec3;
      Vec2 = _cc.Vec2;
      Animation = _cc.Animation;
      ImageAsset = _cc.ImageAsset;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "64b1bMaJVBI2Y02IyMS+ys1", "PlayerMovement", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'UITransform', 'Vec3', 'Vec2', 'Animation', 'ImageAsset']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("PlayerMovement", PlayerMovement = (_dec = ccclass("PlayerMovement"), _dec2 = property({
        type: ImageAsset
      }), _dec3 = property({
        type: Node
      }), _dec4 = property({
        type: Node
      }), _dec(_class = (_class2 = class PlayerMovement extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "playerImage", _descriptor, this);

          _initializerDefineProperty(this, "joystick", _descriptor2, this);

          _initializerDefineProperty(this, "joyStickBall", _descriptor3, this);

          this.pos = null;
          this.startPos = null;
          this.stopPlayer = true;
          this.intialPos = null;
          this.finalPosBall = null;
          this.finalPos = null;
        }

        start() {
          this.touchEventsFunc();
        }

        onLoad() {
          this.finalPosBall = new Vec3(1, 1, 0);
          this.finalPos = this.node.getPosition();
          this.intialPos = new Vec3(1, 1, 0);
          this.startPos = this.joyStickBall.getPosition();
        }

        touchEventsFunc() {
          this.joyStickBall.on(Node.EventType.TOUCH_START, this.touchStart, this);
          this.joyStickBall.on(Node.EventType.TOUCH_MOVE, this.touchMove, this);
          this.joyStickBall.on(Node.EventType.TOUCH_END, this.touchEnd, this);
          this.joyStickBall.on(Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
        }

        touchEnd() {
          this.stopPlayer = false;
          console.log("end");
          this.joyStickBall.setPosition(0, 0, 0);
        }

        touchStart() {
          this.joyStickBall.setPosition(0, 0, 0);
          console.log("start");
        }

        touchMove(e) {
          this.stopPlayer = true;
          this.intialPos = this.joyStickBall.parent.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(e.getUILocation().x, e.getUILocation().y, e.getUILocation().z)); // var finalPosBall: Vec3;

          var len = this.intialPos.length();
          console.log("len", len);
          var joyStickBallBaseWidth = this.joyStickBall.parent.getComponent(UITransform).getBoundingBox().width / 2;

          if (len > joyStickBallBaseWidth) {
            this.intialPos.x = this.intialPos.x * joyStickBallBaseWidth / len;
            this.intialPos.y = this.intialPos.y * joyStickBallBaseWidth / len;
          }

          var dy = this.intialPos.y;
          var dx = this.intialPos.x;
          var angleRad = Math.atan2(dy, dx);
          var angleDeg = angleRad * 180 / Math.PI;
          console.log("angle ", angleDeg, angleRad);
          this.getDirection(angleDeg);
          this.joyStickBall.setPosition(this.intialPos);
        }

        getDirection(angle) {
          if (angle > -15 && angle < 15) {
            this.playWalkAnmation("East");
          } else if (angle > 15 && angle < 75) {
            this.playWalkAnmation("North_East");
          } else if (angle > 75 && angle < 105) {
            this.playWalkAnmation("North");
          } else if (angle > 105 && angle < 165) {
            this.playWalkAnmation("North_West");
          } else if (angle > 165 && angle < 195) {
            this.playWalkAnmation("West");
          } else if (angle > 195 && angle < 255) {
            this.playWalkAnmation("South_West");
          } else if (angle > 255 && angle > 285) {
            this.playWalkAnmation("South");
          } else {
            this.playWalkAnmation("South_East");
          }
        }

        playWalkAnmation(walkDirection) {
          switch (walkDirection) {
            case "North":
              {
                var _this$node$getCompone;

                console.log(walkDirection);
                (_this$node$getCompone = this.node.getComponent(Animation)) == null ? void 0 : _this$node$getCompone.play("north");
              }
              break;

            case "East":
              {
                var _this$node$getCompone2;

                console.log(walkDirection);
                (_this$node$getCompone2 = this.node.getComponent(Animation)) == null ? void 0 : _this$node$getCompone2.play("east");
              }
              break;

            case "South":
              {
                var _this$node$getCompone3;

                console.log(walkDirection);
                (_this$node$getCompone3 = this.node.getComponent(Animation)) == null ? void 0 : _this$node$getCompone3.play("south");
              }
              break;

            case "West":
              {
                var _this$node$getCompone4;

                console.log(walkDirection);
                (_this$node$getCompone4 = this.node.getComponent(Animation)) == null ? void 0 : _this$node$getCompone4.play("west");
              }
              break;

            case "North_East":
              {
                var _this$node$getCompone5;

                console.log(walkDirection);
                (_this$node$getCompone5 = this.node.getComponent(Animation)) == null ? void 0 : _this$node$getCompone5.play("northEast");
              }
              break;

            case "North_West":
              {
                var _this$node$getCompone6;

                console.log(walkDirection);
                (_this$node$getCompone6 = this.node.getComponent(Animation)) == null ? void 0 : _this$node$getCompone6.play("northWest");
              }
              break;

            case "South_East":
              {
                var _this$node$getCompone7;

                console.log(walkDirection);
                (_this$node$getCompone7 = this.node.getComponent(Animation)) == null ? void 0 : _this$node$getCompone7.play("southEast");
              }
              break;

            case "South_West":
              {
                var _this$node$getCompone8;

                console.log(walkDirection);
                (_this$node$getCompone8 = this.node.getComponent(Animation)) == null ? void 0 : _this$node$getCompone8.play("southWest");
              }
              break;
          }
        }

        changeSprite() {}

        update(deltaTime) {
          if (this.stopPlayer) {
            this.pos = new Vec2(this.startPos.x - this.intialPos.x, this.startPos.y - this.intialPos.y);
            this.finalPos.x -= this.pos.x * 0.01;
            this.finalPos.y -= this.pos.y * 0.01;
            this.pos.x = 0;
            this.pos.y = 0;
          }

          var playerPosition = new Vec3();
          var currentPostion = this.node.getPosition();
          Vec3.lerp(playerPosition, currentPostion, this.finalPos, 0.06);
          this.node.setPosition(playerPosition);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "playerImage", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "joystick", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "joyStickBall", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=0a8fdb79a12c2901b9583ccaa55831bb7e4433bc.js.map