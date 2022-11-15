/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import React, { useEffect } from "react";
import { Select, Toggle } from "@itwin/core-react";
import { AttrValues, ViewAttributesApi, ViewFlag } from "./ViewAttributesApi";
import { RenderMode } from "@itwin/core-common";
import { IModelApp } from "@itwin/core-frontend";
import { AbstractWidgetProps, StagePanelLocation, StagePanelSection, UiItemsProvider, WidgetState } from "@itwin/appui-abstract";
import "./ViewAttributes.scss";

export const ViewAttributesWidget: React.FunctionComponent = () => {
  const [attrValuesState, setAttrValuesState] = React.useState<AttrValues>(ViewAttributesApi.settings);

  useEffect(() => {
    _onChangeAttribute(attrValuesState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attrValuesState]);

  const _onChangeAttribute = (attrValues: AttrValues) => {
    const vp = IModelApp.viewManager.selectedView;
    if (vp) {
      ViewAttributesApi.setAttrValues(vp, attrValues);
    }
  };

  const _onChangeRenderMode = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const vp = IModelApp.viewManager.selectedView;
    if (vp) {
      let renderMode: RenderMode;
      switch (event.target.value) {
        case "HiddenLine": { renderMode = RenderMode.HiddenLine; break; }
        // case "Skryté_Hrany": { renderMode = RenderMode.HiddenLine; break; }
        case "SmoothShade": { renderMode = RenderMode.SmoothShade; break; }
        case "SolidFill": { renderMode = RenderMode.SolidFill; break; }
        default:
        case "Wireframe": { renderMode = RenderMode.Wireframe; break; }
      }
      ViewAttributesApi.setRenderMode(vp, renderMode);
      setAttrValuesState({ ...attrValuesState, renderMode });
    }
  };

  // Handle changes to the skybox toggle.
  const _onChangeSkyboxToggle = (checked: boolean) => {
    const vp = IModelApp.viewManager.selectedView;
    if (vp) {
      ViewAttributesApi.setSkyboxOnOff(vp, checked);
    }
  };

  // Handle changes to the camera toggle.
  const _onChangeCameraToggle = (checked: boolean) => {
    const vp = IModelApp.viewManager.selectedView;
    if (vp) {
      ViewAttributesApi.setCameraOnOff(vp, checked);
    }
  };

  // Handle changes to a view flag toggle.
  const _onChangeViewFlagToggle = (flag: ViewFlag, checked: boolean) => {
    const vp = IModelApp.viewManager.selectedView;
    if (vp) {
      ViewAttributesApi.setViewFlag(vp, flag, checked);
    }

  };

  // Handle changes to a view flag toggle.
  const _onTransparencySliderChange = (min: number, max: number, num: number) => {
    const vp = IModelApp.viewManager.selectedView;
    if (vp) {
      ViewAttributesApi.setBackgroundTransparency(vp, Math.abs((num / (max + 1)) - min));
    }
  };

  // This common function is used to create the react components for each row of the UI.
  const createJSXElementForAttribute = (label: string, info: string, element: JSX.Element) => {
    return (
      <>
        <span><span style={{ marginRight: "1em" }} className="icon icon-help" title={info}></span>{label}</span>
        {element}
      </>
    );
  };

  // Create the react components for the render mode row.
  const createRenderModePicker = (label: string, info: string) => {
    const options = {
    //   HiddenLine: "Hidden Line",
      HiddenLine: "Skryté Hrany",
    //   SmoothShade: "Smooth Shade",
      SmoothShade: "Hladké Stínování",
    //   SolidFill: "Solid Fill",
      SolidFill: "Plná Výplň",
    //   Wireframe: "Wireframe",
      Wireframe: "Drátový Model",
    };

    let renderMode: string;
    switch (attrValuesState.renderMode) {
      case RenderMode.HiddenLine: { renderMode = "HiddenLine"; break; }
      case RenderMode.SmoothShade: { renderMode = "SmoothShade"; break; }
      case RenderMode.SolidFill: { renderMode = "SolidFill"; break; }
      case RenderMode.Wireframe: { renderMode = "Wireframe"; break; }
    }

    const element = <Select style={{ width: "fit-content" }} value={renderMode} onChange={_onChangeRenderMode} options={options} />;
    return createJSXElementForAttribute(label, info, element);
  };

  // Create the react components for the skybox toggle row.
  const createSkyboxToggle = (label: string, info: string) => {
    const element = <Toggle isOn={attrValuesState.skybox} onChange={_onChangeSkyboxToggle} />;
    return createJSXElementForAttribute(label, info, element);
  };

  // Create the react components for the camera toggle row.
  const createCameraToggle = (label: string, info: string) => {
    const element = <Toggle isOn={attrValuesState.cameraOn} onChange={_onChangeCameraToggle} />;
    return createJSXElementForAttribute(label, info, element);
  };

  // Create the react components for a view flag row.
  const createViewFlagToggle = (flag: ViewFlag, label: string, info: string) => {
    let flagValue: boolean;

    switch (flag) {
      case ViewFlag.ACS: flagValue = attrValuesState.acs; break;
      case ViewFlag.BackgroundMap: flagValue = attrValuesState.backgroundMap; break;
      case ViewFlag.Grid: flagValue = attrValuesState.grid; break;
      case ViewFlag.HiddenEdges: flagValue = attrValuesState.hiddenEdges; break;
      case ViewFlag.Monochrome: flagValue = attrValuesState.monochrome; break;
      case ViewFlag.Shadows: flagValue = attrValuesState.shadows; break;
      case ViewFlag.VisibleEdges: flagValue = attrValuesState.visibleEdges; break;
    }

    const element = <Toggle isOn={flagValue} onChange={(checked: boolean) => _onChangeViewFlagToggle(flag, checked)} />;
    return createJSXElementForAttribute(label, info, element);
  };

  // Create the react component for the transparency slider
  const createTransparencySlider = (label: string, info: string) => {
    let defVal = 99;
    if (attrValuesState.backgroundTransparency)
      defVal = (attrValuesState.backgroundTransparency * 100) - 1;

    const element = <input type={"range"} min={0} max={99} defaultValue={defVal}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        _onTransparencySliderChange(0, 99, Number(event.target.value))}
    />;
    return createJSXElementForAttribute(label, info, element);
  };

  return (
    <div className="sample-options">
      <div className="sample-options-2col" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {/* {createRenderModePicker("Render Mode", "Controls the render mode.")} */}
        {createRenderModePicker("Režim zobrazení Rendrování", "Umožňuje ovládat režim zobrazení")}
        {/* {createViewFlagToggle(ViewFlag.ACS, "ACS", "Turn on to see a visualization of the active coordinate system.")} */}
        {createViewFlagToggle(ViewFlag.ACS, "ACS neboli aktivní souřadnocový systém", "Vypínač zobrazování vizualizace Aktivního koordinačního systému")}
        {/* {createViewFlagToggle(ViewFlag.BackgroundMap, "Background Map", "Turn on to see the iModel on a map. Turn off to disable map. Does not apply if the selected iModel is not geolocated.")} */}
        {createViewFlagToggle(ViewFlag.BackgroundMap, "Mapa na pozadí", "Vypínač umožní zobrazení iModelu nad mapovým podkladem. Vypnutím přepínače vypne. Nepoužívej pokud nemá iMOdel přiřazenou geografickou polohu.")}
        {/* {createTransparencySlider("Map Transparency", "Adjusting this slider changes the transparency of the background map. Does not apply if map is not currently being displayed.")} */}
        {createTransparencySlider("Průhlednost mapového podladu", "Úpravou polohy ovladače se nastaví úroveň průhlednosti. Nemá efekt paliže není aktuálně připojený žádný mapový podklad.")}
        {/* {createCameraToggle("Camera", "Turn on for perspective view.  Turn off for orthographic view.")} */}
        {createCameraToggle("Typ optiky Kamery", "Zapnutím pohled PERSPEKTIVA.  Vypnutím ORTOGRAFICKÝ pohled")}
        {/* {createViewFlagToggle(ViewFlag.Grid, "Grid", "")} */}
        {createViewFlagToggle(ViewFlag.Grid, "Mřížka", "Do pohledu je přizobrazen mřížková síť")}
        {/* {createViewFlagToggle(ViewFlag.Monochrome, "Monochrome", "Turn on to disable colors.")} */}
        {createViewFlagToggle(ViewFlag.Monochrome, "Monochromaticky", "Zapnutím se odfiltrují barvy do monochromatiského zobrazení")}
        {/* {createViewFlagToggle(ViewFlag.Shadows, "Shadows", "Turn on to see shadows.")} */}
        {createViewFlagToggle(ViewFlag.Shadows, "Stínování", "Zapnutí zobrazí stíny")}
        {/* {createSkyboxToggle("Sky box", "Turn on to see the sky box.")} */}
        {createSkyboxToggle("Krabice s oblaky", "Zapnutím se zobrazí obloha")}
        {/* {createViewFlagToggle(ViewFlag.VisibleEdges, "Visible Edges", "Turn off to disable visible edges.  Only applies to smooth shade render mode.")} */}
        {createViewFlagToggle(ViewFlag.VisibleEdges, "Viditelné Hrany", "Vypnutí zneviditelní hrany.  Zbyde pouze hladké stínování z modelu")}
        {/* {createViewFlagToggle(ViewFlag.HiddenEdges, "Hidden Edges", "Turn on to see hidden edges.  Does not apply to wireframe.  For smooth shade render mode, does not apply when visible edges are off.")} */}
        {createViewFlagToggle(ViewFlag.HiddenEdges, "Skryté Hrany", "Zapnutím zobrazí i jinak pohledem zakryté hrany.  Nemá vliv při zapnutém zobrazení DRÁTOVÝ MODEL.  Při použití v režimu HLADKÉHO STÍNOVÁNÍ neprovede nic protože viditelné hrany jsou v tomto modu vypnuté")}
      </div>
    </div>
  );
};

export class ViewAttributesWidgetProvider implements UiItemsProvider {
  public readonly id: string = "ViewAttributesWidgetProvider";

  public provideWidgets(_stageId: string, _stageUsage: string, location: StagePanelLocation, _section?: StagePanelSection): ReadonlyArray<AbstractWidgetProps> {
    const widgets: AbstractWidgetProps[] = [];
    if (location === StagePanelLocation.Right && _section === StagePanelSection.End) {
      widgets.push(
        {
          id: "ViewAttributesWidget",
        //   label: "View Attributes Controls",
          label: "Ovladače Atributů OKNA prohlížeče",
          defaultState: WidgetState.Floating,
          // eslint-disable-next-line react/display-name
          getWidgetContent: () => <ViewAttributesWidget />,
        }
      );
    }
    return widgets;
  }
}
