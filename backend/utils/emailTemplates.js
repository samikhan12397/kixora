const wrap = (title, bodyHtml) => `
<div style="font-family: Arial, sans-serif; background:#0B0E11; padding:32px; color:#EDEAE3;">
  <div style="max-width:520px; margin:0 auto; background:#14181D; border-radius:12px; padding:32px; border:1px solid #4A4F58;">
    <div style="font-size:24px; font-weight:900; letter-spacing:1px; margin-bottom:24px;">
      KIX<span style="color:#C8FF00;">ORA</span>
    </div>
    <h2 style="color:#EDEAE3; margin-top:0;">${title}</h2>
    ${bodyHtml}
    <p style="color:#8A8F98; font-size:12px; margin-top:32px; border-top:1px solid #4A4F58; padding-top:16px;">
      KIXORA — Thrifted Sneakers, New Life
    </p>
  </div>
</div>`;

export function orderConfirmationEmail(order) {
  const itemsHtml = order.items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px 0; border-bottom:1px solid #4A4F58;">${i.name} (Size ${i.size})</td>
        <td style="padding:8px 0; border-bottom:1px solid #4A4F58; text-align:right;">x${i.quantity}</td>
        <td style="padding:8px 0; border-bottom:1px solid #4A4F58; text-align:right;">$${i.price}</td>
      </tr>`
    )
    .join("");

  return wrap(
    "Order Confirmed",
    `
    <p>Hi ${order.shippingAddress?.fullName || "there"}, thanks for your order! Here's a quick summary:</p>
    <table style="width:100%; border-collapse:collapse; margin:16px 0;">
      <tbody>${itemsHtml}</tbody>
    </table>
    <p style="font-size:18px; font-weight:700; color:#C8FF00;">Total: $${order.grandTotal}</p>
    <p style="color:#8A8F98;">Payment method: ${order.paymentMethod}<br/>Order ID: ${order._id}</p>
    <p style="color:#8A8F98;">We will email you again once your order ships.</p>
    `
  );
}

export function paymentPendingEmail(order) {
  return wrap(
    "Payment Under Review",
    `
    <p>We have received your payment screenshot for order <strong>${order._id}</strong>.
    Our team is verifying it now, you will get a confirmation email as soon as it is approved.</p>
    `
  );
}

export function paymentVerifiedEmail(order) {
  return wrap(
    "Payment Verified - Order Confirmed",
    `
    <p>Good news, your payment for order <strong>${order._id}</strong> has been verified.
    We are preparing your order for shipping now.</p>
    `
  );
}
