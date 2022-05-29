import { IModelConnection, ScreenViewport } from "@bentley/imodeljs-frontend";

export class Visualization {

    public static hideHouseExterior = async (vp: ScreenViewport, toogle?: boolean) => {

        const categoryIds = await Visualization.getCategoryIds(vp.iModel);

        if (toogle) {
          vp.changeCategoryDisplay(categoryIds, toogle);
        } else {
          vp.changeCategoryDisplay(categoryIds, false);
        }
    }
    

    private static getCategoryIds = async (iModel: IModelConnection) => {

        const categoriesToHide: string[] = [
            "'Wall 2nd'",
            "'Wall 1st'",
            "'Dry Wall 2nd'",
            "'Dry Wall 1st'",
            "'Brick Exterior'",
            "'WINDOWS 1ST'",
            "'WINDOWS 2ND'",
            "'Ceiling 1st'",
            "'Ceiling 2nd'",
            "'Callouts'",
            "'light fixture'",
            "'Roof'",
            ];
      
            const query = `SELECT ecinstanceid from Biscore.category
             WHERE codevalue IN (${categoriesToHide.toString()})`;
            
            const result = iModel.query(query);
            const categoryIds = [];
      
            for await (const row of result)
              categoryIds.push(row.id);

            return categoryIds;
        

    }


}