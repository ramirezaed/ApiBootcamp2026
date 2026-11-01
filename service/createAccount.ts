import accountsDao from "../api/account/dao";
import accountsService from "../api/account/service";
import generateAlias from "../utils/generatorAlias";
import generateCvu from "../utils/generatorCvu";

const accountRegistrationService = {
  async create(userId: string) {
    let alias = generateAlias();
    let cvu = generateCvu();

    let [isAliasTaken, isCvuTaken] = await Promise.all([
      accountsDao.findByAlias(alias),
      accountsDao.findByCvu(cvu),
    ]);

    while (isAliasTaken || isCvuTaken) {
      alias = generateAlias();
      cvu = generateCvu();

      [isAliasTaken, isCvuTaken] = await Promise.all([
        accountsDao.findByAlias(alias),
        accountsDao.findByCvu(cvu),
      ]);
    }

    return accountsService.create({
      user: userId,
      cvu,
      alias,
    });
  },
};

export default accountRegistrationService;
