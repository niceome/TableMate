package com.example.TableMate.service;

import com.example.TableMate.domain.Member;
import com.example.TableMate.domain.Post;
import com.example.TableMate.dto.Post.PostCreateRequest;
import com.example.TableMate.dto.Post.PostResponse;
import com.example.TableMate.dto.Post.PostSimpleResponse;
import com.example.TableMate.repository.MemberRepository;
import com.example.TableMate.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final MemberRepository memberRepository;

    public Long create(PostCreateRequest request) {
        Member member = memberRepository.findById(request.memberId())
                .orElseThrow(() -> new IllegalArgumentException("작성자 없음"));

        Post post = Post.builder()
                .title(request.title())
                .category(request.category())
                .dueTime(request.dueTime())
                .party(request.party())
                .content(request.content())
                .writer(member)
                .build();

        return postRepository.save(post).getId();
    }

    public List<PostSimpleResponse> getAll() {
        return postRepository.findAll()
                .stream()
                .map(PostSimpleResponse::from)
                .toList();
    }

    public PostResponse get(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글 없음"));

        return PostResponse.from(post);
    }
}
