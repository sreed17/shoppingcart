import t,{createContext as e,useState as i,useEffect as n,useContext as r}from"react";class s{onChangeHandler(){this.onChangeCallback&&"function"==typeof this.onChangeCallback&&this.onChangeCallback(this)}isParametersValid(){return this._unit_price>=0&&this._quantity>=0&&this._unit_discount>=0&&this._total_discount>=0}updateTotalPrice(){if(!this.isParametersValid())throw new Error("Error updating the total price for the product stack: check the unit_price, quantity, unit_discount, and total_discount parameters and ensure they are non-negative values.");let t=this._quantity*(this._unit_price-this._unit_discount);t-=t*this._total_discount,this._aggregate_price=t}static parse(t,e){const i=JSON.parse(t);if(!function(t){if(!t||"object"!=typeof t)return!1;const e=["index","id","product","unit_price","quantity","unit_discount","total_discount","aggregate_price"];for(let i of e){if(!(i in t))return!1;if("product"!==i&&"id"!==i){const e=Number(t[i]);if(Number.isNaN(e))return!1}if("id"===i){if("string"!=typeof Number(t[i]))return!1}}return!0}(i))throw new Error("Error parsing the ShoppingCartItem: invalid format.");const n={index:i.index,id:i.id,product:i.product,unit_price:i.unit_price,quantity:i.quantity,total_discount:i.total_discount,unit_discount:i.unit_discount};return new s({...n},e)}valueOf(){return{index:this._index,id:this._id,product:{...this._product},unit_price:this.unit_price,quantity:this._quantity,unit_discount:this.unit_discount,total_discount:this.total_discount,aggregate_price:this._aggregate_price}}toJSON(){return this.valueOf()}toString(){return JSON.stringify(this)}clone(){return new s({index:this._index,id:this._id,product:this._product,unit_price:this._unit_price,quantity:this._quantity,unit_discount:this._unit_discount,total_discount:this._total_discount},this.onChangeCallback)}incrementQuantity(t=1){if(t<=0)throw new Error("Error updating the shopping cart item quantity: increment_size must be a positive non-zero number");this._quantity+=t,this.updateTotalPrice(),this.onChangeHandler()}decrementQuantity(t=1){if(t<=0)throw new Error("Error updating the shopping cart item quantity: decrement_size must be a positive non-zero number");const e=this._quantity-t;this._quantity=e<0?0:e,this.updateTotalPrice(),this.onChangeHandler()}setTotalDiscount(t){this._total_discount=t,this.updateTotalPrice(),this.onChangeHandler()}setIndex(t){if(null!==this.prev_index)throw new Error("Error changing the index of cart item: a pending move exists");this._prev_index=this.index,this._index=t}clearPrevIndex(){if(null==this.prev_index)throw new Error("Error trying to clear prev index when prev index is null");this._prev_index=null}get index(){return this._index}get prev_index(){return this._prev_index}get id(){return this._id}get product(){return this._product}get unit_price(){return this._unit_price}get quantity(){return this._quantity}get unit_discount(){return this._unit_discount}get total_discount(){return this._total_discount}get aggregate_price(){return this._aggregate_price}constructor(t,e){this._prev_index=null,this._aggregate_price=0;const{index:i,id:n,product:r,unit_price:s,quantity:o=1,unit_discount:a=0,total_discount:h=0}=t;this._index=i,this._id=n,this._product=r,this._quantity=o,this._unit_price=s,this._unit_discount=a,this._total_discount=h,this.onChangeCallback=e,this.updateTotalPrice()}}function o(t){return!(!t||"object"!=typeof t)&&t instanceof s}class a{updateDependentStates(){const t={};let e=0;for(let i=0;i<this.items.length;i++){this.items[i].setIndex(i);t[this.items[i].id]=i,this.items[i].clearPrevIndex(),e+=this.items[i].aggregate_price}this._sub_total=e,this.hmap=t}emitOnChange(){this.onChange&&this.onChange(this)}addNewItem(t){let e;e=o(t)?t:new s(t,this.onChange),this.items.push(e),this.hmap[t.id]=t.index,this._sub_total+=e.aggregate_price,this.emitOnChange()}removeItemByIndex(t){if(t<0||t>=this.items.length)throw new Error(`Error removing cart item by index: index out of bound. index[${t}]`);this.items[t].id,this.items.splice(t,1),this.updateDependentStates(),this.emitOnChange()}removeItemById(t){if(!(t in this.hmap))throw new Error(`Error removing cart item by id: id not found. id[${t}]`);const e=this.hmap[t];this.items.splice(e,1),this.updateDependentStates(),this.emitOnChange()}moveItem(t,e){const i="number"==typeof t?t:this.hmap[t];if("number"!=typeof i)throw new Error("Error repositioning cart item: identifier cant be resolved, or not found. Check the identifier <index | id>");if(e<0||e>=this.items.length)throw new Error("Error repositioning cart item: new_index is out of bound.");const n=this.items.splice(i,1);this.items.splice(e,0,...n),null!==this.items[e].prev_index&&this.items[e].clearPrevIndex(),this.updateDependentStates(),this.emitOnChange()}get item_count(){return this.items.length}get sub_total(){return this._sub_total}getCartItem(t){switch(typeof t){case"string":if(t in this.hmap)throw new Error(`Error getting the cart item by id: id not found. id[${t}]`);return this.items[this.hmap[t]];case"number":if(t<0||t>=this.items.length)throw new Error(`Error getting the cart item by index: index out of bound. index[${t}]`);return this.items[t]}}*[Symbol.iterator](){for(const t of this.items)yield t}static parse(t,e){let i=t.trim();i=i.replace(/(^\[|\]$)/g,"");const n=i.split(","),r=[];for(const t of n)r.push(s.parse(t,e));return r}valueOf(){return this.items.map((t=>t.valueOf()))}toJSON(){return this.valueOf()}toString(){return JSON.stringify(this)}clone(){return new a({items:this.items,onChange:this.onChange,onCheckout:this.onCheckout})}map(t){return this.items.map(((e,i)=>t(e.valueOf(),i)))}addItem(t){const e=t.id,i=e in this.hmap,n={...t,index:this.items.length};if(!i)return this.addNewItem(n);this.items[this.hmap[e]].incrementQuantity(t.quantity)}removeItem(t,e){if("number"==typeof e&&e>0){const i=this.getCartItem(t);return i.quantity-e<=0?void this.removeItemByIndex(i.index):void i.decrementQuantity(e)}switch(typeof t){case"string":return this.removeItemById(t);case"number":return this.removeItemByIndex(t)}}filter(t){this.items.filter(t),this.updateDependentStates(),this.emitOnChange()}sort(t){this.items.sort(t),this.updateDependentStates(),this.emitOnChange()}checkout(){if(this.onCheckout)return this.onCheckout(this);throw new Error("Error: Called checkout function without providing a onCheckout function")}constructor(t){this.hmap={},this._sub_total=0;const{items:e=[],onChange:i,onCheckout:n}=t;if(i&&"function"!=typeof i)throw new Error("Type error: onChange must be a function. see the documentation.");if(n&&"function"!=typeof n)throw new Error("Type error: onCheckout must be a function. see the documentation.");this.items=[...e],this.onChange=i,this.onCheckout=n,this.updateDependentStates()}}class h{constructor(t){this.key=t}save(t){localStorage.setItem(this.key,JSON.stringify(t))}load(){const t=localStorage.getItem(this.key);return t?JSON.parse(t):null}clear(){localStorage.removeItem(this.key)}}const u={disabled:!0,clear_on_reload:!1,storage:new h("shopping_cart")};function c(){const s=e(null);return{ShoppingCartProvider:(c=s,({children:e,onCheckout:r,initialItems:s,persist:h})=>{const d={...u,...h},[p,l]=i(null),[_,m]=i(!0);n((()=>{const{disabled:t,clear_on_reload:e,storage:i}=d;let n;i&&!t&&(n=i.load());const h="string"==typeof n?a.parse(n):void 0,u=new a({onChange:t=>{o(t)?l((t=>t?t.clone():null)):l(t.clone())},onCheckout:r,items:s??h??void 0});return l(u),m(!1),()=>{const{disabled:t,clear_on_reload:e,storage:i}=d;i&&(t||e)&&i.clear()}}),[]),n((()=>{const{storage:t,disabled:e}=d;!e&&t&&t.save(p)}),[p]);const g={cart:p,is_loading:_};return t.createElement(c.Provider,{value:g},e)}),useShoppingCart:(h=s,()=>{const t=r(h);if(!t)throw new Error("Error: useShoppingCartContext must be used inside ShoppingCartProvider.");return t})};var h,c}export{h as LocalStoragePersistence,c as default};
//# sourceMappingURL=index.mjs.map