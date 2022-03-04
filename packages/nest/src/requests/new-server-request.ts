import { IsNotBlank } from "../IsNotBlank";

class NewServerRequest {
  @IsNotBlank()
  name: string;
}

export default NewServerRequest;
