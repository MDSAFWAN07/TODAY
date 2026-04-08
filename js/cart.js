document.addEventListener('DOMContentLoaded', () => {
    const cartItemsEl = document.getElementById('cartItems');
    const totalEl = document.getElementById('total');
    const origButton = document.querySelector('button');

    // Hide original unstyled elements
    if (totalEl && totalEl.parentElement) totalEl.parentElement.style.display = 'none';
    if (origButton && origButton.textContent.includes('Proceed')) origButton.style.display = 'none';

    const _rupeeFormatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
    function formatCurrency(v){ return _rupeeFormatter.format(Number(v) || 0); }

    function loadPending() {
        try { return JSON.parse(localStorage.getItem('pendingOrder') || '[]'); } catch (e) { return []; }
    }

    function loadCart() {
        try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch (e) { return []; }
    }

    const pending = loadPending();
    const cart = loadCart();
    const itemsToShow = pending.length ? pending : cart;

    if (!itemsToShow.length) {
        cartItemsEl.innerHTML = '<p style="padding:12px">No items in cart.</p>';
        totalEl.innerText = formatCurrency(0);
        return;
    }

    // Build styled cart page
    const container = document.createElement('div');
    container.className = 'cart-page';

    const title = document.createElement('h2');
    title.innerText = 'Your Cart';
    container.appendChild(title);

    let total = 0;

    itemsToShow.forEach(item => {
        const row = document.createElement('div');
        row.className = 'cart-list-row';

        const thumb = document.createElement('div');
        thumb.className = 'thumb';
        const img = document.createElement('img');
        img.src = item.image || 'website dishes/download.jpg';
        img.alt = item.name;
        thumb.appendChild(img);

        const details = document.createElement('div');
        details.className = 'details';
        const name = document.createElement('h4');
        name.innerText = item.name;
        const desc = document.createElement('p');
        desc.innerText = item.hotel ? item.hotel : '';

        // meta row: rating and address
        const meta = document.createElement('div');
        meta.style.display = 'flex';
        meta.style.flexDirection = 'column';
        meta.style.gap = '4px';

        if (item.rating) {
            const rt = document.createElement('div');
            rt.style.color = '#ffb400';
            rt.style.fontWeight = '700';
            rt.textContent = `⭐ ${item.rating}`;
            meta.appendChild(rt);
        }

        if (item.address) {
            const addr = document.createElement('div');
            addr.style.color = '#666';
            addr.style.fontSize = '13px';
            addr.textContent = item.address;
            meta.appendChild(addr);
        }

        details.appendChild(name);
        details.appendChild(desc);
        if (meta.childNodes.length) details.appendChild(meta);

        const price = document.createElement('div');
        price.className = 'price';
        const linePrice = (item.price || 0) * (item.qty || 1);
        // show amount label + value
        price.innerHTML = `<div style="font-size:13px;color:#666">Amount</div><div class="price-value">${formatCurrency(linePrice)}</div>`;
        total += linePrice;

        const qtyControls = document.createElement('div');
        qtyControls.className = 'qty-controls';
        const minus = document.createElement('button'); minus.className = 'qty-btn'; minus.textContent = '-';
        const qtyInput = document.createElement('input'); qtyInput.className = 'qty-input'; qtyInput.type = 'number'; qtyInput.min = 1; qtyInput.value = item.qty || 1;
        const plus = document.createElement('button'); plus.className = 'qty-btn'; plus.textContent = '+';
        const remove = document.createElement('button'); remove.className = 'remove'; remove.textContent = 'Remove';

        qtyControls.appendChild(minus);
        qtyControls.appendChild(qtyInput);
        qtyControls.appendChild(plus);
        qtyControls.appendChild(remove);

        row.appendChild(thumb);
        row.appendChild(details);
        row.appendChild(price);
        row.appendChild(qtyControls);

        // Handlers
        minus.addEventListener('click', () => {
            const v = Math.max(1, Number(qtyInput.value) - 1);
            qtyInput.value = v;
            updateQty(item.id, v);
            const priceValue = price.querySelector('.price-value');
            if (priceValue) priceValue.innerText = formatCurrency((item.price || 0) * v);
            recalcTotal();
        });
        plus.addEventListener('click', () => {
            const v = Math.max(1, Number(qtyInput.value) + 1);
            qtyInput.value = v;
            updateQty(item.id, v);
            const priceValue = price.querySelector('.price-value');
            if (priceValue) priceValue.innerText = formatCurrency((item.price || 0) * v);
            recalcTotal();
        });
        qtyInput.addEventListener('change', () => {
            const v = Math.max(1, Number(qtyInput.value) || 1);
            qtyInput.value = v;
            updateQty(item.id, v);
            const priceValue = price.querySelector('.price-value');
            if (priceValue) priceValue.innerText = formatCurrency((item.price || 0) * v);
            recalcTotal();
        });
        remove.addEventListener('click', () => {
            removeItem(item.id);
            row.remove();
            recalcTotal();
        });

        container.appendChild(row);
    });

    // total area and checkout
    const totalArea = document.createElement('div');
    totalArea.className = 'cart-total-area';
    const lbl = document.createElement('div'); lbl.className = 'total-label'; lbl.innerText = 'Total: ' + formatCurrency(total); lbl.dataset.value = total;
    const btn = document.createElement('button'); btn.className = 'checkout-btn'; btn.innerText = 'Proceed to Checkout';
    btn.addEventListener('click', () => {
        openCheckout();
    });
    totalArea.appendChild(lbl); totalArea.appendChild(btn);
    container.appendChild(totalArea);

    // render
    cartItemsEl.innerHTML = '';
    cartItemsEl.appendChild(container);
    totalEl.innerText = formatCurrency(total);

    function updateQty(id, qty){
        const cartAll = JSON.parse(localStorage.getItem('cart') || '[]');
        const item = cartAll.find(i => i.id === id);
        if (item) { item.qty = qty; localStorage.setItem('cart', JSON.stringify(cartAll)); }
        const pendingAll = JSON.parse(localStorage.getItem('pendingOrder') || '[]');
        const p = pendingAll.find(i => i.id === id);
        if (p) { p.qty = qty; localStorage.setItem('pendingOrder', JSON.stringify(pendingAll)); }
    }

    function removeItem(id){
        let cartAll = JSON.parse(localStorage.getItem('cart') || '[]');
        cartAll = cartAll.filter(i => i.id !== id);
        localStorage.setItem('cart', JSON.stringify(cartAll));
        let pendingAll = JSON.parse(localStorage.getItem('pendingOrder') || '[]');
        pendingAll = pendingAll.filter(i => i.id !== id);
        localStorage.setItem('pendingOrder', JSON.stringify(pendingAll));
    }

    function recalcTotal(){
        const all = JSON.parse(localStorage.getItem('pendingOrder') || '[]');
        const cartAll = JSON.parse(localStorage.getItem('cart') || '[]');
        const source = all.length ? all : cartAll;
        let t = 0; source.forEach(i => t += (i.price || 0) * (i.qty || 1));
        totalEl.innerText = formatCurrency(t); lbl.innerText = 'Total: ' + formatCurrency(t); lbl.dataset.value = t;
    }

    /* Checkout modal */
    function openCheckout(){
        const modal = document.createElement('div');
        modal.className = 'checkout-modal';

        const dialog = document.createElement('div');
        dialog.className = 'checkout-dialog';
        dialog.innerHTML = `
            <h3>Checkout</h3>
            <form class="checkout-form">
                <div id="checkoutItems" style="display:flex;flex-direction:column;gap:8px;margin-bottom:8px"></div>

                <input id="c_name" placeholder="Full name" required />
                <input id="c_phone" placeholder="Phone number" required />
                <textarea id="c_address" placeholder="Delivery address" rows="3" required></textarea>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px">
                    <div style="font-weight:700">Total: <span id="c_total">${total}</span></div>
                </div>
                <div class="checkout-actions">
                    <button type="button" class="btn btn-cancel">Cancel</button>
                    <button type="submit" class="btn btn-confirm">Confirm Order</button>
                </div>
            </form>
        `;

        modal.appendChild(dialog);
        document.body.appendChild(modal);

        // Prefill name if logged in
        try {
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            if (user && user.name) document.getElementById('c_name').value = user.name;
            if (user && user.email) document.getElementById('c_phone').value = user.email;
        } catch (e) {}

        modal.addEventListener('click', (ev) => { if (ev.target === modal) closeCheckout(modal); });
        dialog.querySelector('.btn-cancel').addEventListener('click', () => closeCheckout(modal));

        // populate order summary inside the modal
        const checkoutItemsEl = dialog.querySelector('#checkoutItems');
        const source = JSON.parse(localStorage.getItem('pendingOrder') || '[]');
        const cartAll = JSON.parse(localStorage.getItem('cart') || '[]');
        const itemsSource = source.length ? source : cartAll;

        itemsSource.forEach(it => {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.gap = '10px';
            row.style.padding = '8px';
            row.style.borderRadius = '8px';
            row.style.background = '#fff';
            row.style.boxShadow = '0 6px 14px rgba(0,0,0,0.03)';

            const thumb = document.createElement('img');
            thumb.src = it.image || 'website dishes/download.jpg';
            thumb.alt = it.name;
            thumb.style.width = '64px';
            thumb.style.height = '48px';
            thumb.style.objectFit = 'cover';
            thumb.style.borderRadius = '6px';

            const meta = document.createElement('div');
            meta.style.flex = '1';
            const nm = document.createElement('div'); nm.textContent = it.name; nm.style.fontWeight = '700';
            const small = document.createElement('div'); small.style.fontSize = '12px'; small.style.color = '#666'; small.textContent = it.address || '';
            meta.appendChild(nm); meta.appendChild(small);

            const qtyWrap = document.createElement('div'); qtyWrap.style.display = 'flex'; qtyWrap.style.alignItems = 'center'; qtyWrap.style.gap='6px';
            const qtyInput = document.createElement('input'); qtyInput.type='number'; qtyInput.min='1'; qtyInput.value = it.qty || 1; qtyInput.style.width='56px'; qtyInput.style.padding='6px'; qtyInput.style.border='1px solid #eee'; qtyInput.style.borderRadius='6px';

            const linePrice = document.createElement('div'); linePrice.style.fontWeight='800'; linePrice.textContent = formatCurrency((it.price||0) * (it.qty||1));

            qtyWrap.appendChild(qtyInput);

            // when qty changes update linePrice and total
            qtyInput.addEventListener('change', () => {
                const v = Math.max(1, Number(qtyInput.value) || 1);
                qtyInput.value = v;
                // reflect on storage temp (we'll save on confirm)
                it.qty = v;
                linePrice.textContent = formatCurrency((it.price||0) * v);
                // update total
                const curTotal = itemsSource.reduce((s, x) => s + ((x.price||0) * (x.qty||1)), 0);
                const totalElInModal = document.getElementById('c_total'); if (totalElInModal) { totalElInModal.innerText = formatCurrency(curTotal); totalElInModal.dataset.value = curTotal; }
            });

            row.appendChild(thumb);
            row.appendChild(meta);
            row.appendChild(qtyWrap);
            row.appendChild(linePrice);
            checkoutItemsEl.appendChild(row);
        });

        // ensure c_total shows up-to-date value
        const totalElInModalInit = document.getElementById('c_total'); if (totalElInModalInit) { const initVal = itemsSource.reduce((s,x)=>s+((x.price||0)*(x.qty||1)),0); totalElInModalInit.innerText = formatCurrency(initVal); totalElInModalInit.dataset.value = initVal; }

        dialog.querySelector('.checkout-form').addEventListener('submit', (ev) => {
            ev.preventDefault();
            const name = document.getElementById('c_name').value.trim();
            const phone = document.getElementById('c_phone').value.trim();
            const address = document.getElementById('c_address').value.trim();
            if (!name || !phone || !address) { alert('Please complete all fields'); return; }

            // Build order object
            const all = JSON.parse(localStorage.getItem('pendingOrder') || '[]');
            const cartAll = JSON.parse(localStorage.getItem('cart') || '[]');
            const source = all.length ? all : cartAll;
            const finalItems = itemsSource.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty || 1 }));
                const order = {
                id: 'ORD' + Date.now(),
                customer: { name, phone, address },
                items: finalItems,
                    total: Number(document.getElementById('c_total').dataset.value) || total,
                createdAt: new Date().toISOString()
            };

            // For now we just save order locally and clear cart
            localStorage.setItem('lastOrder', JSON.stringify(order));
            localStorage.removeItem('pendingOrder');
            localStorage.removeItem('cart');
            alert('Order confirmed! Order ID: ' + order.id);
            closeCheckout(modal);
            window.location.href = 'index.html';
        });
    }

    function closeCheckout(modal){
        if (modal && modal.parentNode) modal.parentNode.removeChild(modal);
    }
});
