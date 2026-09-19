import api from '../utils/api'

class AccountService {
  getAccountList(page: number, filter: any) {
    return api.post(`account-statement-list?page=${page}`, filter)
  }

  getBets22(matchId: number) {
    return api.get(`bets22?matchId=${matchId}`);
  }

  getMatkaBets22(matchId: number) {
    return api.get(`matkabets22?matchId=${matchId}`);
  }

  matchdetail(page:any,limit:any,) {
    return api.get(`matchdetail?page=${page}&limit=${limit}`);
  }
  matchdetail2(mid?: any) {
  return api.get(`matchdetail-two${mid ? `?mid=${mid}` : ""}`);
}
  matkagamelist() {
    return api.get(`matka-list`);
  }

  matkagamelistRollBack() {
    return api.get(`matka-list-rollback`);
  }

   getBets32(data:any) {
    return api.post(`bet32`,data);
  }

  comgames(){
    return api.get('completedgames')
  }

  comgamescasino(){
    return api.get('completedgamescasino')
  }


  marketcasino() {
    return api.get('marketcasino')
  }
  

  marketmatkaa() {
    return api.get('marketmatka')
  }

   bookmarketmatkaa(id:any) {
    return api.get(`bookmarketmatka?gid=${id}`)
  }

  getAccountList22() {
    return api.post(`account-statement-list-22`)
  }
  getProfitLoss(page: number, filter: any) {
    return api.post(`profit-loss?page=${page}`, filter)
  }
  casinoProfitLoss(
  page = 1,
  limit = 100,
  startDate = "",
  endDate = ""
) {
  return api.get(
    `/casino-profit-loss?page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`
  );
}

casinoProfitLossDetails(
  matchId: string,
  date: string
) {
  return api.get(
    `/casino-profit-loss-details?matchId=${encodeURIComponent(
      matchId
    )}&date=${encodeURIComponent(
      date
    )}`
  );
}

}
export default new AccountService()
