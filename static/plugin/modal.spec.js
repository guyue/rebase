describe('Modal Test Suite', function () {
    'use strict';

    var expect = chai.expect;

    function inject(callback, isAysnc) {
        return function (done) {
            seajs.use(['/plugin/modal'], function (Modal) {

                if (isAysnc) {
                    callback(Modal, done);
                } else {
                    callback(Modal);
                    done();
                }

            });
        };
    }

    var ratchet;

    before(function () {
        ratchet = document.createElement('link');
        ratchet.rel = 'stylesheet';
        ratchet.href = '/sass/ratchet.css';
        document.head.appendChild(ratchet);
    });

    after(function () {
        if (ratchet.parentNode) {
            ratchet.parentNode.removeChild(ratchet);
        }
        ratchet = undefined;
    });

    describe('Constructor', function () {

        it('使用new或函数的调用方式，都会返回Modal实例对象', inject(function (Modal) {
            var element = document.createElement('div');
            expect(new Modal(element)).to.be.an.instanceOf(Modal);
            expect(Modal(element)).to.be.an.instanceOf(Modal);
        }));

        it('当传入的element参数无效时，将抛出错误', inject(function (Modal) {

            expect(function () {
                new Modal();
            }).to.throw(TypeError);

            expect(function () {
                new Modal('.modal');
            }).to.throw(TypeError);

            expect(function () {
                new Modal(document.querySelectorAll('.modal'));
            }).to.throw(TypeError);

        }));

    });

    describe('Modal.prototype', function () {
        var modalElement,
            transitionDuration;

        beforeEach(function () {
            var div = document.createElement('div');
            div.innerHTML = '<div class="modal">' +
                    '<header class="bar bar-nav">' +
                        '<button class="icon icon-cross pull-right" data-toggle="modal-close"></button>' +
                        '<h1 class="title">红莓花儿开</h1>' +
                    '</header>' +
                    '<div class="content">' +
                        '<div class="content-padded">' +
                            '<p>田野小河边，红莓花儿开，有一位少年真使我心爱，可是我不能对他表白，满怀的心腹话儿没法讲出来！</p>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            modalElement = div.firstElementChild;
            [].slice.call(ratchet.sheet.cssRules).forEach(function (rule) {
                if (rule.selectorText === '.modal') {
                    // 此处不考虑单位，默认单位为s
                    transitionDuration = parseFloat(rule.style.transitionDuration || rule.style.webkitTransitionDuration) * 1000 || 0;
                    // 并默认 + 100s
                    transitionDuration += 100;
                }
            });
        });

        afterEach(function () {
            if (modalElement.parentNode) {
                modalElement.parentNode.removeChild(modalElement);
            }
            modalElement = null;
        });

        function isOpen() {
            var style = window.getComputedStyle(modalElement);
            return modalElement.offsetTop === 0 &&
                modalElement.offsetLeft === 0 &&
                modalElement.offsetWidth === window.innerWidth &&
                modalElement.offsetHeight === window.innerHeight &&
                parseInt(style.opacity, 10) === 1;
        }

        function asyncExpect(callback) {
            setTimeout(callback, transitionDuration);
        }

        describe('open', function () {
 
            it('打开Modal弹层', inject(function (Modal, done) {
                var modal = new Modal(modalElement);
                modal.open();
                asyncExpect(function () {
                    expect(isOpen()).to.be.true;
                    done();
                });
            }, true));
 
        });

        describe('close', function () {
 
            it('关闭（隐藏）Modal弹层', inject(function (Modal, done) {
                var modal = new Modal(modalElement);
                modal.open();
                asyncExpect(function () {
                    expect(isOpen()).to.be.true;
                    modal.close();
                    asyncExpect(function () {
                        expect(isOpen()).to.be.false;
                        modal.open();
                        asyncExpect(function () {
                            expect(isOpen()).to.be.true;
                            modal.close();
                            asyncExpect(function () {
                                expect(isOpen()).to.be.false;
                                done();
                            });
                        });
                    });
                });
            }, true));
 
        });

        describe('destroy', function () {
 
            it('销毁Modal弹层', inject(function (Modal, done) {
                var modal = new Modal(modalElement);
                modal.destroy();
                modal.open();
                asyncExpect(function () {
                    expect(isOpen()).to.be.false;
                    done();
                });
            }, true));
 
        });

    });

});
