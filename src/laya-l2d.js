class LayaLive2D extends Laya.Sprite {
    
    constructor() {
        super();
        this.l2dstage = null;
        this.url = null;
        this.mouseDown = false;

        this.on('display', this, this.displayHandler);
        this.on('undisplay', this, this.undisplayHandler);
    }
    
    displayHandler(event) {
        Laya.stage.on('click', this, this.stageClickHandler);
        
        Laya.stage.on('mousedown', this, this.stageDragStartHandler);
        Laya.stage.on('dragstart', this, this.stageDragStartHandler);
        
        Laya.stage.on('dragmove', this, this.stageDragMoveHandler);
        Laya.stage.on('mousemove', this, this.stageDragMoveHandler);
        
        Laya.stage.on('dragend', this, this.stageDragEndHandler);
        Laya.stage.on('mouseup', this, this.stageDragEndHandler);
        Laya.stage.on('mouseout', this, this.stageDragEndHandler);
    }
    
    undisplayHandler(event) {
        Laya.stage.off('click', this, this.stageClickHandler);
        
        Laya.stage.off('mousedown', this, this.stageDragStartHandler);
        Laya.stage.off('dragstart', this, this.stageDragStartHandler);
        
        Laya.stage.off('dragmove', this, this.stageDragMoveHandler);
        Laya.stage.off('mousemove', this, this.stageDragMoveHandler);
        
        Laya.stage.off('dragend', this, this.stageDragEndHandler);
        Laya.stage.off('mouseup', this, this.stageDragEndHandler);
        Laya.stage.off('mouseout', this, this.stageDragEndHandler);
    }

    stageClickHandler(event) {
        let x = Laya.stage.mouseX;
        let y = Laya.stage.mouseY;
        if (this.l2dstage) {
            this.l2dstage.tapEvent(x, y);
        }
    }
    
    stageDragStartHandler(event) {
        this.mouseDown = true;
    }
    
    stageDragMoveHandler(event) {
        if (!this.mouseDown) {
            return;
        }
        let x = Laya.stage.mouseX;
        let y = Laya.stage.mouseY;
        if (this.l2dstage) {
            this.l2dstage.setPoint([x, y]);
        }
    }

    stageDragEndHandler(event) {
        if (!this.mouseDown) {
            return;
        }
        this.mouseDown = false;
        if (this.l2dstage) {
            this.l2dstage.setPoint();
        }
    }

    get width() {
        if (this.l2dstage && this.l2dstage.firstModel) {
            return this.l2dstage.firstModel.width;
        }
        else {
            return 0;
        }
    }

    get height() {
        if (this.l2dstage && this.l2dstage.firstModel) {
            return this.l2dstage.firstModel.height;
        }
        else {
            return 0;
        }
    }

    load(url) {
        this.url = url;
        if (this.l2dstage == null) {
            this.l2dstage = new L2DStage(Laya.WebGL.mainContext);
            this.l2dstage.stageResizeEvent(Laya.stage.width, Laya.stage.height);
        }
        for(;;) {
            let model = this.l2dstage.removeModelAt(0);
            if (model == null) {
                break;
            }
            this.l2dstage.releaseModel(model);
        }
        var model = this.l2dstage.createModel(url);
        return model.load().then(_ => {
            model.update();
            model.layoutActual();
            this.l2dstage.appendModel(model);
        });
    }

    layoutDefault() {
        if (this.l2dstage && this.l2dstage.firstModel) {
            let args = [].slice.call(arguments);
            this.l2dstage.firstModel.layoutDefault.apply(this.l2dstage.firstModel, args);
        }
    }

    layoutActual() {
        if (this.l2dstage && this.l2dstage.firstModel) {
            let args = [].slice.call(arguments);
            this.l2dstage.firstModel.layoutActual.apply(this.l2dstage.firstModel, args);
        }
    }
    
    clickHandler(event) {
        console.log(event);
        if (this.l2dstage && this.l2dstage.firstModel) {
            // this.l2dstage.firstModel.pla
        }
    }
    
    /// override render
    render(context, x, y) {
        // console.log(x, y);
        if (this.l2dstage == null) {
            return;
        }

        Laya.Render._context.ctx._renderKey = 0;//打断2D合并的renderKey
        context.addRenderObject(this);
    }

    /// ISubmit
    renderSubmit() {
        // console.log('renderSubmit() {');
        this.l2dstage.draw();

        // refresh inner cache
        Laya.Buffer._bindActive = [];
        Laya.BaseShader.activeShader = null
        Laya.BlendMode.activeBlendFunction = null;
        Laya.WebGLContext._useProgram = null;

        // restore inner states
        let gl = Laya.WebGL.mainContext;
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        // gl.blendFunc(gl.ONE, gl.ZERO);
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);
        gl.depthMask(true);
        gl.frontFace(gl.CCW);

        return 1;
    }

    /// ISubmit
    getRenderType() {
        return Laya.Submit.TYPE_CUSTOM;
    }

    /// ISubmit
    releaseRender() {
        // console.log('releaseRender() {');
    }

    // test
    static main() {
        Config.isAlpha = true; // optional: set background transparent
        Laya.init(600, 480, Laya.WebGL); // required: turn on webgl
        Laya.stage.bgColor = 'none'; // optional: set background transparent
        // Laya.Stat.show(); // optional: show stat info
        Laya.stage.scaleMode = Laya.Stage.SCALE_SHOWALL;
        Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;
        Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE;
        
        if (LayaLive2D.instance == null) {
            let live2d = new LayaLive2D;
            LayaLive2D.instance = live2d;
            live2d.x = 0;
            live2d.y = 0;
            Laya.stage.addChild(live2d);
        }

        let txt = new Laya.Text();
        txt.fontSize = 36;
        txt.text = "Hello World";
        txt.color = "#0000ff";
        Laya.stage.addChild(txt);
    }
}
