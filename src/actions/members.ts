import { BASE_URL } from "@/lib/constants";
import { Member, Result } from "@/types/dto";

export const getMembersByProjectIdRequest = async ({ id }: { id: string }): Promise<Result<Member[]>> => {
  return axios.get(`${BASE_URL}/api/members/by-project/${id}`)
    .then(response => {
      return [null, response.data]
    }).catch(error => {
      return [error, null]
    })
}