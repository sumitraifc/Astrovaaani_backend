const repo = require("./repository");

exports.createOrder = async (userId, data) => {
  const order = await repo.create({
    user_id: userId,
    astrologer_name: data.astrologer_name,
    consultation_type: data.consultation_type,
    price: data.price,
    image: data.image || null,
    status: "pending"
  });

  return {
    success: true,
    message: "Order created",
    order
  };
};

// exports.getOrders = async (userId) => {
//   const orders = await repo.getAll(userId);
//   //  console.log("orders in service :",orders);
//   return {
//     success: true,
//     orders
//   };
// };
exports.getOrders = async (userId, page, limit) => {
  const result = await repo.getAll(userId, page, limit);

  const data = result.rows.map(order => ({
    ...order,
    astrologer_image: order.astrologer_image
      ? `${process.env.BASE_URL}/uploads/${order.astrologer_image}`
      : null
  }));

  return {
    success: true,
    total: result.total,
    page: result.page,
    limit: result.limit,
    orders:data
  };
};

exports.getOrderById = async (userId, id) => {
  const order = await repo.getById(userId, id);
  
  if (!order) {
    return {
      success: false,
      message: "Order not found"
    };
  }
  // profile image full URL
  order.profile_image = order.profile_image
    ? `${process.env.BASE_URL}/uploads/${order.profile_image}`
    : null;

  return {
    success: true,
    order
  };
};