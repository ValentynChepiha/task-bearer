class UserDto {
  db_id;
  id;
  id_type;

  constructor(model) {
    this.db_id = model._id;
    this.id = model.id;
    this.id_type = model.id_type;
  }
}

module.exports = UserDto;