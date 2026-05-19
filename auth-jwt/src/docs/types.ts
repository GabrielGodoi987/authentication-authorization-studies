export interface SwaggerController {
  tag: { name: string; description: string };
  paths: Record<string, Record<string, any>>;
}

export interface SwaggerSpecOptions {
  controllers: SwaggerController[];
  schemas?: Record<string, any>;
}
