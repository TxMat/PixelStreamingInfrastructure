// Copyright Epic Games, Inc. All Rights Reserved.

import { FullScreenIcon } from './FullscreenIcon';
import { SettingsIcon } from './SettingsIcon';
import { StatsIcon } from './StatsIcon';
import { XRIcon } from './XRIcon';
import { WebXRController } from '@epicgames-ps/lib-pixelstreamingfrontend-ue5.3';
import { UIElementConfig, UIElementCreationMode } from '../UI/UIConfigurationTypes'
import {VideoQpIndicator} from "./VideoQpIndicator";

/**
 * Configures how UI elements to control the stream are created. 
 * By default, a button will be created for each control. That can be overriden per-control
 * to use an externally provided element, or to disable the element entirely.
 */
export type ControlsUIConfiguration = {
    //[Property in keyof Controls as `${Property}Type`]? : UIElementType;
    statsButtonType? : UIElementConfig,
    fullscreenButtonType? : UIElementConfig,
    settingsButtonType? : UIElementConfig,
    xrIconType? : UIElementConfig
}

// If there isn't a type provided, default behaviour is to create the element.
function shouldCreateButton(type : UIElementConfig | undefined) : boolean {
    return (type == undefined) ? true : (type.creationMode === UIElementCreationMode.CreateDefaultElement);
}

/**
 * Element containing various controls like stats, settings, fullscreen.
 */
export class Controls {
    statsIcon: StatsIcon;
    fullscreenIcon: FullScreenIcon;
    settingsIcon: SettingsIcon;
    xrIcon: XRIcon;
    QPIndicator: VideoQpIndicator;

    _rootElement: HTMLElement;

    /**
     * Construct the controls
     */
    constructor(config? : ControlsUIConfiguration) {
        if (!config || shouldCreateButton(config.statsButtonType)) {
            this.statsIcon = new StatsIcon();
        }
        if (!config || shouldCreateButton(config.settingsButtonType)){
            this.settingsIcon = new SettingsIcon();
        }
        if (!config || shouldCreateButton(config.fullscreenButtonType)) {
            this.fullscreenIcon = new FullScreenIcon();
        }
        if (!config || shouldCreateButton(config.xrIconType)){
            this.xrIcon = new XRIcon();
        }
        this.QPIndicator = new VideoQpIndicator();

    }

    /**
     * Get the element containing the controls.
     */
    public get rootElement(): HTMLElement {
        if (!this._rootElement) {
            this._rootElement = document.createElement('div');
            this._rootElement.id = 'controls';
            if (!!this.fullscreenIcon) {
                this._rootElement.appendChild(this.fullscreenIcon.rootElement);
            }
            if (!!this.settingsIcon) {
                this._rootElement.appendChild(this.settingsIcon.rootElement);
            }
            if (!!this.statsIcon) {
                this._rootElement.appendChild(this.statsIcon.rootElement);
            }
            if (!!this.xrIcon) {
                WebXRController.isSessionSupported('immersive-vr').then(
                (supported: boolean) => {
                    if (supported) {
                        this._rootElement.appendChild(this.xrIcon.rootElement);
                    }
                });
            }
            this._rootElement.appendChild(this.QPIndicator.rootElement);

            // Add CSS styles for transition
            this._rootElement.style.transition = 'right 0.5s ease';

            // Add event listener for fullscreen change
            document.addEventListener('fullscreenchange', this.handleFullscreenChange.bind(this));
        }
        return this._rootElement;
    }

    /**
     * Handler for fullscreen change event
     */
    private handleFullscreenChange(): void {
        // Check if the document is in fullscreen mode
        const isInFullscreen = !!document.fullscreenElement;

        if (isInFullscreen) {
            // Hide the controls when in fullscreen mode
            this._rootElement.style.right = '-10%';
        } else {
            // Show the controls when not in fullscreen mode
            this._rootElement.style.right = '1%';
        }
    }
}