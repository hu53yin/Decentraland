let base = new Entity();

base.addComponent(new GLTFShape("models/Theatre.glb"));
base.addComponent(
  new Transform({
    position: new Vector3(8, 0, 8),
  })
);

engine.addEntity(base);

base.getComponent(Transform).rotation.eulerAngles = new Vector3(0, 270, 0);

let cylinder = new CylinderShape();
let wheel1 = new Entity();
wheel1.addComponent(cylinder);
wheel1.addComponent(
  new Transform({
    position: new Vector3(6, 2, 11.9),
    rotation: Quaternion.Euler(90, 0, 0),
    scale: new Vector3(1, 0.05, 1),
  })
);

engine.addEntity(wheel1);

let wheel2 = new Entity();
wheel2.addComponent(cylinder);
wheel2.addComponent(
  new Transform({
    position: new Vector3(10, 2, 11.9),
    rotation: Quaternion.Euler(90, 0, 0),
    scale: new Vector3(1, 0.05, 1),
  })
);

engine.addEntity(wheel2);

let myMaterial = new Material();
myMaterial.albedoTexture = new Texture("images/hypno-wheel.png");

wheel1.addComponent(myMaterial);
wheel2.addComponent(myMaterial);

wheel1.addComponent(
  new OnPointerDown(
    (e) => {
      log("wiii");
      wheel1.getComponent(WheelSpin).active = true;
      wheel1.getComponent(WheelSpin).speed += 20;
    },
    { button: ActionButton.POINTER, hoverText: "Spin" }
  )
);

wheel2.addComponent(
  new OnPointerDown(
    (e) => {
      log("wiii");
      wheel2.getComponent(WheelSpin).active = true;
      wheel2.getComponent(WheelSpin).speed += 20;
    },
    { button: ActionButton.POINTER, hoverText: "Spin" }
  )
);

// let avocado = new Entity()

// avocado.addComponent(new GLTFShape("models/avocado.gltf"))

// avocado.addComponent(
//   new Transform({
//     position: new Vector3(3, 1, 3),
//     scale: new Vector3(10, 10, 10),
//   })
// )

// engine.addEntity(avocado)

@Component("wheelSpin")
export class WheelSpin {
  speed: number = 0;
  active: boolean = false;
  direction: Vector3 = Vector3.Up();
}

wheel1.addComponent(new WheelSpin());
wheel2.addComponent(new WheelSpin());
wheel2.getComponent(WheelSpin).direction = Vector3.Down();

const wheels = engine.getComponentGroup(WheelSpin, Transform);

class RotatorSystem implements ISystem {
  update(dt: number) {
    for (let wheel of wheels.entities) {
      let transform = wheel.getComponent(Transform);
      let spin = wheel.getComponent(WheelSpin);

      if (spin.active) {
        transform.rotate(spin.direction, spin.speed * dt);
        spin.speed *= 0.99;
      }

      if (spin.speed < 1) {
        spin.active = false;
      }
    }
  }
}

engine.addSystem(new RotatorSystem());
