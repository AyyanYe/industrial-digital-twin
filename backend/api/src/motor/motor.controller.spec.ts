import { Test, TestingModule } from '@nestjs/testing';
import { MotorController } from './motor.controller';

describe('MotoController', () => {
  let controller: MotorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MotorController],
    }).compile();

    controller = module.get<MotorController>(MotorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
