import { UniverDoc } from '@univer/core';
import { RenderEngine } from '@univer/base-render';
import { UniverComponentSheet } from '@univer/style-universheet';
import { DocsPlugin } from './DocsPlugin';

const univerDocUp = UniverDoc.newInstance();

univerDocUp.installPlugin(new RenderEngine());
univerDocUp.installPlugin(new UniverComponentSheet());

univerDocUp.installPlugin(new DocsPlugin());
