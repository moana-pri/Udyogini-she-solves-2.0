router.post("/", auth("customer"), async (req, res) => {
  try {
    const booking = await Booking.create({
      customerId: req.user.id,
      businessId: req.body.businessId,
      service: req.body.service,
      date: req.body.date,
      time: req.body.time,
      price: req.body.price,
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
