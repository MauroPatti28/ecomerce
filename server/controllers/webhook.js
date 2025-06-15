const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Orden = require('../models/orden'); 
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Firma inválida del webhook:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

if (event.type === 'checkout.session.completed') {
  const session = event.data.object;

  console.log("✅ Webhook recibido - Checkout completado");
  console.log("📦 Metadata recibida:", session.metadata);

  const userId = session.metadata.userId;
  const items = JSON.parse(session.metadata.items);
  const total = session.amount_total / 100;

  console.log("🧾 userId:", userId);
  console.log("🛒 items:", items);
  console.log("💰 total:", total);

  try {
   const nuevaOrden = new Orden({
  user: userId,
  items: items.map(i => ({
    producto: i.productoId, 
    cantidad: i.cantidad
  })),
  total,
});

    await nuevaOrden.save();
    console.log("✅ Orden guardada correctamente.");
  } catch (err) {
    console.error("❌ Error al guardar la orden:", err);
  }
}}
