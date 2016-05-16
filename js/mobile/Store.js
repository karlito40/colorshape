'use strict';

(function(exports){

exports.Store = {
    hasBeenInit: false,
    products: [],
    onPurchase: null,
    connect: function(onReady){
        if (!Cocoon.Store.nativeAvailable || this.hasBeenInit) {
          if(onReady) onReady();
        }

        this.hasBeenInit = true;

        var self = this;
        Cocoon.Store.on('load', {
            started: function(){ console.log('Fetching products...'); },
            success: function(products) {
                for(var i=0; i<products.length; i++) {
                    Cocoon.Store.addProduct(products[i]);
                    console.log('Adding product to the local database', JSON.stringify(products[i]));
                }

                if(onReady) onReady();

            },

            error: function(errorMessage) {
                console.log('load store error', errorMessage);
            }
        });

        Cocoon.Store.on('purchase', {
            started: function(productId) {
                console.log('initialize purchase on', productId);
            },
            success: function(purchaseInfo) {
                console.log('purchase complete', JSON.stringify(purchaseInfo));

                Cocoon.Store.addPurchase(purchaseInfo);

                if(self.onPurchase && Cocoon.Store.isProductPurchased(purchaseInfo.productId)) {
                    self.onPurchase(purchaseInfo.productId);
                }
            },

            error: function(productId, error) {
                console.log('purchase error ', productId, JSON.stringify(error));
            }
        });

        Cocoon.Store.on('restore', {
            started: function(){console.log('restore init'); },
            success: function(){console.log('restore termine'); },
            error: function(errorMessage){console.log('error', errorMessage)}
        });

        Cocoon.Store.initialize({
            sandbox: CS.config.store.sandbox,
            managed: true
        });

        Cocoon.Store.start();
        Cocoon.Store.loadProducts(this.products);
    }

}


})(window.Mobile = window.Mobile || {});
