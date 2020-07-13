

const {ccclass, property} = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {


    update(dt){
        this.moveSelf(dt)
    }

    private moveSelf(dt: number){
        
    }

}
