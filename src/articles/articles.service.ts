import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ArticlesService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}
  create(createArticleDto: CreateArticleDto) {
    return this.prisma.article.create({ data: createArticleDto });
  }

  async findAll() {
    const testValue = this.configService.get<string>('TEST');
    console.log(testValue); // 환경 변수 출력
    const res = await this.prisma.article.findMany({});
    return res;
  }

  findDrafts() {
    return this.prisma.article.findMany({ where: { published: false } });
  }

  findOne(id: number) {
    return this.prisma.article.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    try {
      return await this.prisma.article.update({
        where: {
          id: id,
        },
        data: {
          title: updateArticleDto.title,
          description: updateArticleDto.description,
          body: updateArticleDto.body,
          published: updateArticleDto.published,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  remove(id: number) {
    return this.prisma.article.delete({ where: { id } });
  }
}
