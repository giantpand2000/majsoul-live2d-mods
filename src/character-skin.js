(function() {
    let createL2d = (path) => {
        let l2d = null;
        if (path.endsWith("model3.json")) {
            l2d = new LayaLive2DV3;
        }
        else {
            l2d = new LayaLive2D;
        }
        l2d.load(path).then(_ => l2d.layoutDefault(0, 0, Laya.stage.width / 2, Laya.stage.height));
        return l2d;
    };

    let l2dMap = new Map([
        [400101, "/0/live2d/official-models/haru/haru.model.json"],
        // [400201, "/0/live2d/azur-lane/bisimai_2/bisimai_2.model3.json"],
    ].map(([id, url, layoutFn]) => [id, [createL2d(url), layoutFn || 'layoutActual']]));

    let l2dForCharId = id => l2dMap.get(id);
    let clearL2ds = function() {
        for (let [l2d] of l2dMap.values()) {
            if (l2d.parent) {
                l2d.parent.removeChild(l2d);
            }
        }
    };

    let the_skin_class = uiscript.UI_Character_Skin;
    class L2D_Character_Skin extends the_skin_class {
        constructor(elem) {
            super(elem)
            
            let elem_proxied = new Proxy(elem, this);
            this.me = elem_proxied;
            this.img = elem_proxied;
            this.origin_rect = uiscript.UIRect.CreateFromSprite(this.img);
            this.img.skin = "";
            this._img_visible = true;

            this.syncTimerHandler = this.syncSize.bind(this);
            this.syncTimer = false;
            this.l2dRect = [];
        }

        // proxy elem
        set (target, prop, value) {
            console.log('set elem', prop, value, this.l2d != null);
            if (this.l2d == null) {
                target[prop] = value;
                return true;
            }

            let l2d = this.l2d;
            let layoutFn = this.layoutFn;
            if (prop == 'visible') {
                target[prop] = this.img_visible;
            }
            else if (prop == 'x' || prop == 'y' || prop == 'width' || prop == 'height') {
                
                target[prop] = value;

                // sync size
                let {x, y, width, height} = this.img;
                let {x: l, y: t} = this.img.parent.localToGlobal({x, y}, true);
                let {x: r, y: b} = this.img.parent.localToGlobal({x: x + width, y: y + height}, true);
                let [x0, y0, w0, h0] = this.l2dRect;
                let [x1, y1, w1, h1] = [l, t, r - l, b - t];
                if (x0 !== x1 || y0 !== y1 || w0 !== w1 || h0 !== h1) {
                    this.l2dRect = [x1, y1, w1, h1];
                    l2d[layoutFn](this.l2dRect);
                }
            }
            else {
                target[prop] = value;
            }

            return true;
        }

        set img_visible(value) {
            this._img_visible = value;
            this.img.visible = value;
        }

        get img_visible() {
            return this._img_visible;
        }

        _setLoadedTexture (charId, skinType) {
            let arr = l2dForCharId(charId);
            this.l2d = null;
            this.stopSyncSize();
            if (arr && skinType == 'full') {
                let [l2d, layoutFn] = arr;
                this.l2d = l2d;
                this.layoutFn = layoutFn;
                this.img_visible = false;
                this.img.parent.addChildAt(l2d, 0);
                this.loaded = true;
                this.startSyncSize();
            }
            else {
                if (skinType == 'full') {
                    clearL2ds();
                }
                super._setLoadedTexture(charId, skinType);
                this.img_visible = true;
            }
        }

        startSyncSize() {
            if (this.syncTimer == false) {
                this.syncTimer = true;
                requestAnimationFrame(this.syncTimerHandler);
            }
        }

        stopSyncSize() {
            this.syncTimer = false;
        }

        syncSize() {
            if (this.l2d && this.l2d.parent) {
                // trigger sync size
                this.img.x = this.img.x;
            }
            if (this.syncTimer) {
                requestAnimationFrame(this.syncTimerHandler);
            }
        }

        clear () {
            super.clear();
            this.img_visible = true;
            clearL2ds();
            this.l2d = null;
            this.stopSyncSize();
        }
    }
    uiscript.UI_Character_Skin = L2D_Character_Skin;
})();
