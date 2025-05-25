import { readFile, writeFile } from "fs/promises";
import type { z } from "zod";
import type { registryItemSchema } from "./schema";
import { glob } from "glob";

console.log("Building unified registry...");

// Define the RegistryConfig interface using a single RegistryType
type RegistryType = z.infer<typeof registryItemSchema>["type"];

interface RegistryConfig {
    type: RegistryType;
    path: string;
    targetFunction: (path: string) => string;
}

const registryConfigs: RegistryConfig[] = [
    {
        type: "registry:ui",
        path: "./src/components/minimal-tiptap/**/*",
        targetFunction: (path: string) => path.replace("src/components/minimal-tiptap", "components/ui/minimal-tiptap"),
    },
];

async function buildRegistry() {
    const unifiedRegistry: z.infer<typeof registryItemSchema> = {
        name: "unified-registry",
        type: "registry:block",
        registryDependencies: getRegistryDependencies(),
        dependencies: getDependencies(),
        devDependencies: getDevDependencies(),
        tailwind: {
            config: {
                plugins: ["require(\"tailwindcss-animate\")", "require(\"@tailwindcss/typography\")"],
                theme: {
                    extend: {
                        typography: {
                            DEFAULT: {
                                css: {
                                    'code::before': {
                                        content: `''`,
                                    },
                                    'code::after': {
                                        content: `''`,
                                    },
                                    code: {
                                        background: '#f3f3f3',
                                        wordWrap: 'break-word',
                                        padding: '.1rem .2rem',
                                        borderRadius: '.2rem',
                                    }
                                }
                            }
                        }
                    }
                }
            },
        },
        cssVars: {},
        files: [],
    };

    for (const config of registryConfigs) {
        const files = await glob(config.path, { nodir: true });
        for (const file of files) {
            await processFile(file, unifiedRegistry, config);
        }
    }

    const registryFileName = "block-registry.json";

    await writeFile(
        `./registry/${registryFileName}`,
        JSON.stringify(unifiedRegistry, null, 2)
    );

    console.log(`Unified registry (${ registryFileName }) built successfully!`);
}



function getDependencies(): string[] {
    // Dependencies from README.md installation instructions
    return [
        "@tiptap/extension-code-block-lowlight",
        "lowlight",
        "react-medium-image-zoom",
        "@tiptap/extension-color",
        "@tiptap/extension-heading",
        "@tiptap/extension-horizontal-rule",
        "@tiptap/extension-image",
        "@tiptap/extension-link",
        "@tiptap/extension-placeholder",
        "@tiptap/extension-text-style",
        "@tiptap/extension-typography",
        "@tiptap/pm",
        "@tiptap/react",
        "@tiptap/starter-kit",
        "@tiptap/extension-underline",
        "@radix-ui/react-icons"
    ];
}

function getDevDependencies(): string[] {
    return [
        "@tailwindcss/typography",
        "tailwindcss-animate"
    ];
}

function getRegistryDependencies(): string[] {
    return [
        "button",
        "dropdown-menu",
        "input",
        "label",
        "popover",
        "separator",
        "switch",
        "toggle",
        "tooltip",
        "dialog",
        "toggle-group",
        "sonner",
    ];
}

async function processFile(
    file: string,
    registry: z.infer<typeof registryItemSchema>,
    config: RegistryConfig
) {

    const targetPath = config.targetFunction(file);
    console.log("Processing file", { file, type: config.type, target: targetPath });

    const content = await readFile(file, "utf-8");

    const fileEntry = {
        path: file,
        content,
        type: config.type,
        target: targetPath,
    };

    registry.files!.push(fileEntry);
}

buildRegistry();